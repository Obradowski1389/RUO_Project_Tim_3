import json
import boto3

def check_respond(event, context):
    body = event
    print(event)
    email = body['targetEmail']
    sender = body.get("senderEmail")

    table_name = "Sharing"
    dynamodb = boto3.resource("dynamodb")
    tab = dynamodb.Table(table_name)
    response = tab.get_item(Key={'targetEmail': email})
    print("Response: ", str(response))

    if 'Item' in response:
        item = response['Item']
        print(item)
        if item.get("status") == "ACCEPTED":
            print(True)
            return {
                "status": True,
                "senderEmail": sender,
                "targetEmail": email
            }
        elif item.get("status") ==  "DECLINED":
            print(False)
            return {
                "status": False,
                "senderEmail": sender,
                "targetEmail": email
            }
        else:
            raise Exception("Invitation doesn't have a reponse")
    else:
        raise Exception("Invitation doesn't have a reponse")
    