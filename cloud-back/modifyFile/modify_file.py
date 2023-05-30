import boto3
import json


table_name = 'metadata-cloud-back'
dynamodb = boto3.resource('dynamodb')


def update_file(event, context):
    body = json.loads(event['body'])
    item_id = body['id']

    table = dynamodb.Table(table_name)
    response = table.get_item(Key={'id': item_id})
    if 'Item' not in response:
        return {
            'statusCode': 404,
            'body': 'Item not found'
        }

    table.update_item(
        Key={'id': item_id},
        UpdateExpression='SET #attr1 = :val1, #attr2 = :val2, #attr3 = :val3',
        ExpressionAttributeNames={
            '#attr1': 'name',
            '#attr2': 'description',
            '#attr3': 'tags'
        },
        ExpressionAttributeValues={
            ':val1': body['name'],
            ':val2': body['description'],
            ':val3': body['tags']
        }
    )

    return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": "Successfully updated!"
            }),
    }
