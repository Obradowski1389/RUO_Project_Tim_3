import json
import boto3

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
    cognito = boto3.client('cognito-idp')
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

    client = boto3.client("ses", region_name='eu-central-1')
    subject = "Invitation For Sharing Cloud Storage"
    body = f"You have been invited to join DocHub by {sender}!\n Proceed to http://localhost:4200/familyRegistration to respond to the invite"
    message = {"Subject": {"Data": subject}, "Body": {"Html": {"Data": body}}}
    try:

        response = client.send_email(            
            Source="isomidobradovic@gmail.com", Destination={"ToAddresses": [email]}, Message=message)
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