import boto3
import json

table_name = "Sharing"
dynamodb = boto3.resource('dynamodb')

def get_invitations(event, context):
    username = event['pathParameters']['username']

    params = {
        'TableName': table_name,
        'FilterExpression': '#attr1 = :val1',
        'ExpressionAttributeNames': {
            '#attr1': 'senderUsername'
        },
        'ExpressionAttributeValues': {
            ':val1': username
        }
    }

    response = dynamodb.Table(table_name).scan(**params)
    print("Response: ", str(response))

    if 'Items' in response and len(response['Items']) > 0:
        return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(response['Items']),
        }