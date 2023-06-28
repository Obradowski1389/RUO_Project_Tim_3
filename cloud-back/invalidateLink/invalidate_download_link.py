import json
import boto3


table_name = 'SharingLink'
dynamodb = boto3.resource('dynamodb')


def invalidate_download_link(event, context):
    try:
        body = json.loads(event['body'])
        id = body['id']
        
        table = dynamodb.Table(table_name)
        resp = table.get_item(Key={'id': id})
        if 'Item' not in resp:
            return {
                'statusCode': 404,
                'body': 'Item not found'
            }
        
        table.update_item(
            Key={'id': id},
            UpdateExpression='SET #attr1 = :val1',
            ExpressionAttributeNames={
                '#attr1': 'status',
            },
            ExpressionAttributeValues={
                ':val1': 'NOT_VALID',
            }
        )

        return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "message": "Successfully invalidated!"
                }),
        }
    except Exception as e:
        return {
            "statusCode": 500,
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "message": f"Internal Server Error: {e}"
                }),
        }