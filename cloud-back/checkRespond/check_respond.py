import json
import boto3

def check_respond(event, context):
    body = event
    print(event)
    email = body.get('targetEmail')
    sender = body.get("senderEmail")

    table_name = "Sharing"
    dynamodb = boto3.resource("dynamodb")

    response = dynamodb.Table(table_name).get_item(Key={'targetEmail': email})
    print("Response: ", str(response))

    if 'Items' in response and len(response['Items']) > 0:
        item = response['Items'][0]
        if item.get("status") == {"S": "ACCEPTED"} or item.get("status") == {"S": "DECLINED"}:
            return {
                "status": True,
                "senderEmail": sender,
                "targetEmail": email
            }
        else:
            raise Exception("Invitation doesn't have a reponse")
    else:
        raise Exception("Invitation doesn't have a reponse")
        