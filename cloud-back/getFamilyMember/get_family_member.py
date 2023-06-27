import boto3
import json

dynamodb = boto3.resource('dynamodb')
table_name="Sharing"

def get_sharing_info(event):
    body = json.loads(event['body'])
    email = body['email']
    print(email)

    table = dynamodb.Table(table_name)
    response = table.get_item(Key={'targetEmail': email})
    print(response)
    if 'Item' in response:
        return response["Item"]
    return None

def get_username(event, context):
    item = get_sharing_info(event)
    if item is None:
        return {
        "statusCode": 404,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "message": "Family member not found"
        }),
    }

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({"username": item["senderUsername"]}),
    }
