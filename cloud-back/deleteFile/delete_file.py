import boto3
import json

table_name = 'FileMetadataTable'
bucket_name = 'filee-storage-bucket'
dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

def delete_one_file(event, context):
    body = json.loads(event['body'])
    
    if body['isFolder']:
        delete_folder(body)
    else:
        delete_file(body)
    
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "message": "Successfully deleted doc!"
        }),
    }
    
def delete_file(body):
    table = dynamodb.Table(table_name)
    
    response = table.delete_item(
        Key={ 'id': body['id'] }
    )
    
    s3.delete_object(
        Bucket=bucket_name,
        Key=body['name']
    )
    
def delete_folder(body):
    prefix = body['name']
    table = dynamodb.Table(table_name)
    
    response = table.scan(
        FilterExpression='begins_with(#key, :prefix)',
        ExpressionAttributeNames={'#key': 'name'},
        ExpressionAttributeValues={':prefix': prefix}
    )
    
    items = response['Items']
    for item in items:
        table.delete_item(Key={ 'id': item['id'] })
        s3.delete_object(Bucket=bucket_name, Key=item['name'])