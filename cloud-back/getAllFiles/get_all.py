import boto3
import json
from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return str(o)
        return super(DecimalEncoder, self).default(o)

def get_all_for_user(event, context):
    dynamodb = boto3.resource('dynamodb')
    table_name = 'FileMetadataTable'
    prefix = event['pathParameters']['username']
    
    response = dynamodb.Table(table_name).scan(
        FilterExpression='begins_with(#key, :prefix)',
        ExpressionAttributeNames={'#key': 'name'},
        ExpressionAttributeValues={':prefix': prefix}
    )
    
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(response['Items'], cls=DecimalEncoder),
    }
