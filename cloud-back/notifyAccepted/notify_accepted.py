import json
import boto3

client = boto3.client("ses", region_name='eu-central-1')


def notify_accepted(event, context):
    body = event
    targetEmail = body.get("targetEmail")
    senderEmail = body.get("senderEmail")

    subject = "Cloud Storage Sharing Notification"
    
    body = f"User {targetEmail} has accepted your invite for sharing your storage. Now they have access to all your files. You can change this at any time."
    message = {"Subject": {"Data": subject}, "Body": {"Html": {"Data": body}}}
    try:

        response = client.send_email(            
            Source="isomidobradovic@gmail.com", Destination={"ToAddresses": [senderEmail]}, Message=message)
        
        return event
    except Exception as e:
        print("Error:", e)
        

