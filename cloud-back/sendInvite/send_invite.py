import json
import boto3
# from trycourier import Courier

def send_email(event, context):
    try:
        body = json.loads(event['body'])
        email = body['targetEmail']
        client = boto3.client("ses", region_name='eu-central-1')
        subject = "Invitation For Sharing Cloud Storage"
        body = "test"
        message = {"Subject": {"Data": subject}, "Body": {"Html": {"Data": body}}}
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
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": "Error: Failed to send request. Please try again later."
            }),
        }