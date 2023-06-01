import json
import boto3


# placeholder - poruka koja ce se poslati
def send_notification(event, context):
    body = json.loads(event['body'])
    email = body['targetEmail']
    client = boto3.client("ses")
    subject = "Notification For Cloud Storage"
    data = body['placeholder']
    message = {"Subject": {"Data": subject}, "Body": {"Html": {"Data": data}}}
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