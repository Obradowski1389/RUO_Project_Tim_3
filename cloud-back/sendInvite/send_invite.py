import json
import boto3
import base64

table_name = "Sharing"
dynamodb = boto3.resource('dynamodb')
cognito = boto3.client('cognito-idp')
client = boto3.client("ses", region_name='eu-central-1')


def return_error(message, statusCode):
    return {
        "statusCode": statusCode,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "message": message
        }),
    }

def send_email(event, context):
    body = json.loads(event['body'])
    email = body['targetEmail']
    sender = body["senderEmail"]
    username = body["username"]

    sender64 = base64.b64encode(sender.encode("ascii")).decode("ascii")
    email64 = base64.b64encode(email.encode("ascii")).decode("ascii")
    user64 = base64.b64encode(username.encode("ascii")).decode("ascii")

    if(email is None or sender is None):
        return return_error("Bad request. Please input user email", 400)

    if check_sharing_info(event):
        return return_error("This email already has an account or has been invited to join DocHub.", 400)
    subject = "Invitation For Sharing Cloud Storage"
    body = f"You have been invited to join DocHub!\n Proceed to http://localhost:4200/familyRegistration?send={sender64}&target={email64}&u={user64} to respond to the invite"
    message = {"Subject": {"Data": subject}, "Body": {"Html": {"Data": body}}}
    try:

        response = client.send_email(            
            Source="isomidobradovic@gmail.com", Destination={"ToAddresses": [email]}, Message=message)
        save_sharing_info(event)
        
        return {
            "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "message": "Successfully sent!"
                }),
        }
    except Exception as e:
        print("Error:", e)
        return return_error("Error: Failed to send request. Please try again later.", 500)

def check_sharing_info(event):
    body = json.loads(event['body'])
    email = body['targetEmail']
    sender = body["senderEmail"]

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
            ':val1': sender
        }
    }

    response = dynamodb.Table(table_name).scan(**params)
    if 'Items' in response and len(response['Items']) > 0:
        return True

    return False

def save_sharing_info(event):
    body = json.loads(event['body'])
    email = body['targetEmail']
    sender = body["senderEmail"]
    username = body["username"]
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
