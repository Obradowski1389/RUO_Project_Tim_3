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
        data = f"Files have been shared with you on DocHub by {body['from']}!\n Proceed to {temp} to respond"
        message = {"Subject": {"Data": subject}, "Body": {"Html": {"Data": data}}}
        write_to_dynamo(uid, body['name'])
        if email != "copy":
            response = client.send_email(Source="isomidobradovic@gmail.com",
                                    Destination={"ToAddresses": [email]}, Message=message)

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