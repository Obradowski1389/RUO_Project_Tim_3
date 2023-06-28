import boto3
import json


def check_status(event, context):
    try:
        table_name = "SharingLink"
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table(table_name)
        body = json.loads(event['body']) 
        response = table.get_item(Key={'id': body['id']})
        item = response.get('Item')

        if item:
            status = item.get('status')
            if status == 'VALID':
                return {
                    "statusCode": 200,
                    "headers": {
                        "Access-Control-Allow-Origin": "*"
                    },
                    "body": json.dumps({
                        "message": "VALID"
                    }),
                }
            elif status == 'NOT_VALID':
                    return {
                        "statusCode": 403,
                        "headers": {
                            "Access-Control-Allow-Origin": "*"
                        },
                        "body": json.dumps({
                            "message": "NOT_VALID"
                        }),
                    }
    except Exception as e:
        print("Error while checking status:", e)
        
    return {
        "statusCode": 404,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "message": "NOT_FOUND"
        }),
    }
