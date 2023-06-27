import json
import boto3


# placeholder - poruka koja ce se poslati
def share_file_folder(event, context):
    try:
        body = json.loads(event['body'])
        email = body['to']
        client = boto3.client("ses")
        subject = "Notification For Cloud Storage"
        data = f"Files have been shared with you on DocHub by {body['from']}!\n Proceed to http://localhost:4200/claimData?target={body['name']}&isFolder={body['isFolder']}&type={body['type']} to respond"
        message = {"Subject": {"Data": subject}, "Body": {"Html": {"Data": data}}}
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
                "message": "Successfully sent!"
            }),
    }