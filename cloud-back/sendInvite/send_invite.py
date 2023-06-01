import json
import boto3


def send_email(event, context):
    email = json.loads(event['body'])['targetEmail']
    client = boto3.client("ses")
    subject = "Invitation For Sharing Cloud Storage"
    body = "test"
    message = {"Subject": {"Data": subject}, "Body": {"Html": {"Data": body}}}
    response = client.send_email(Source="isomidobradovic@gmail.com",
                                 Destination={"ToAddresses": [email]}, Message=message)
    return {
        "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": "Successfully sent!"
            }),
    }