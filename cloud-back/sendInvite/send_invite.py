import json
import boto3
import base64

table_name = "Sharing"
dynamodb = boto3.resource('dynamodb')
cognito = boto3.client('cognito-idp')
client = boto3.client("ses", region_name='eu-central-1')


def send_email(event, context):
    body = event
    email = body.get('targetEmail')
    sender = body.get("senderEmail")
    username = body.get("username")
    print("email: ", email)
    print("sender: ", sender)
    print("username: ", username)

    sender64 = base64.b64encode(sender.encode("ascii")).decode("ascii")
    email64 = base64.b64encode(email.encode("ascii")).decode("ascii")
    user64 = base64.b64encode(username.encode("ascii")).decode("ascii")

    if(email is None or sender is None):
        return { "status": False}

    if check_sharing_info(event):
        print("Invite already exists")
        return { "status": False}

    subject = "Invitation For Sharing Cloud Storage"
    body = f"You have been invited to join DocHub!\n Proceed to http://localhost:4200/familyRegistration?send={sender64}&target={email64}&u={user64} to respond to the invite"
    message = {"Subject": {"Data": subject}, "Body": {"Html": {"Data": body}}}
    try:

        response = client.send_email(            
            Source="isomidobradovic@gmail.com", Destination={"ToAddresses": [email]}, Message=message)
        save_sharing_info(event)
        
        return {
            "status": True,
            "targetEmail": email,
            "senderEmail": sender,
            "username": username
        }
    except Exception as e:
        print("Error:", e)
        return { "status": False}


def check_sharing_info(event):
    body = event
    email = body.get('targetEmail')
    sender = body.get("senderEmail")
    username = body.get("username")

    table = dynamodb.Table(table_name)
    response = table.get_item(Key={'targetEmail': email})
    if 'Item' in response:
        return True
    
    params = {
        'TableName': table_name,
        'FilterExpression': '#attr1 = :val1',
        'ExpressionAttributeNames': {
            '#attr1': 'senderEmail'
        },
        'ExpressionAttributeValues': {
            ':val1': email
        }
    }

    response = dynamodb.Table(table_name).scan(**params)
    if 'Items' in response and len(response['Items']) > 0:
        return True

    return False

def save_sharing_info(event):
    body = event
    email = body.get('targetEmail')
    sender = body.get("senderEmail")
    username = body.get("username")
    try:
        table = dynamodb.Table(table_name)
        table.put_item(
            Item= {
                "targetEmail" : email,
                "senderEmail": sender,
                "senderUsername": username,
                "status": "PENDING"
            }
        )
    except Exception as ex:
        print("Error: ", ex)
        raise ex
