import json
import boto3

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


def get_user(username):
    response = cognito.admin_get_user(
        UserPoolId='eu-central-1_a1fZUXk6x',
        Username=username
    )

    user_attributes = response['UserAttributes']
    print('User:', user_attributes)
    return user_attributes


def send_email(event, context):
    body = json.loads(event['body'])
    email = body['targetEmail']
    sender = body["senderUsername"]
    if(email is None or sender is None):
        return_error("Bad request. Please input user email", 400)

    subject = "Invitation For Sharing Cloud Storage"
    body = f"You have been invited to join DocHub by {sender}!\n Proceed to http://localhost:4200/familyRegistration to respond to the invite"
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
        return_error("Error: Failed to send request. Please try again later.", 500)

def save_sharing_info(event):
    body = json.loads(event['body'])
    email = body['targetEmail']
    sender = body["senderUsername"]
    try:
        table = dynamodb.Table(table_name)
        print("awofijofijasf")
        table.put_item(
            Item= {
                "targetEmail" : email,
                "senderUsername": sender,
                "status": "CREATED"
            }
        )
    except Exception as ex:
        print("Error: ", ex)
        return_error("Error: wiriting in DB", 500)
