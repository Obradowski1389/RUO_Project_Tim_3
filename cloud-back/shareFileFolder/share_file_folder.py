import json
import boto3
import uuid


table_name = "SharingLink"
dynamodb = boto3.resource('dynamodb')


def share_file_folder(event, context):
    try:
        body = json.loads(event['body'])
        email = body['to']
        client = boto3.client("ses")
        uid = str(uuid.uuid4())
        subject = "Notification For Cloud Storage"
        
        temp = f"http://localhost:4200/claimData?id={uid}&target={body['name']}&isFolder={body['isFolder']}&type={body['type']}"
        for_sender = f"http://localhost:4200/invalidateLink?id={uid}&target={body['name']}&isFolder={body['isFolder']}&type={body['type']}"

        data = f"Files have been shared with you on DocHub by {body['from']}!\n Proceed to {temp} to respond"
        data_for_sender = f"You shared file:{body['name']} with: {email}!\n Proceed to {for_sender} to cancel sharing this file."

        message = {"Subject": {"Data": subject}, "Body": {"Html": {"Data": data}}}
        message_for_sender = {"Subject": {"Data": subject}, "Body": {"Html": {"Data": data_for_sender}}}
        
        write_to_dynamo(uid, body['name'])
        if email != "copy":
            response = client.send_email(Source="isomidobradovic@gmail.com",
                                    Destination={"ToAddresses": [email]}, Message=message)
            response = client.send_email(Source="isomidobradovic@gmail.com",
                                    Destination={"ToAddresses": [body['from']]}, Message=message_for_sender)
            

    except Exception as e:
        print(e)
    
    return {
        "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": "Successfully sent!",
                "link": temp
            }),
    }


def write_to_dynamo(id, name):
    table = dynamodb.Table(table_name)
    table.put_item(
        Item = {
            "id": id,
            "name": name,
            "status": "VALID"
        }
    )