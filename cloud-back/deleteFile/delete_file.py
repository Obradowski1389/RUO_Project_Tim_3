import boto3
import json

table_name = 'FileMetadataTable'
bucket_name = 'filee-storage-bucket'
dynamodb = boto3.client('dynamodb')
s3 = boto3.client('s3')

def delete_one_file(event, context):
    body = json.loads(event['body'])
    
    delete_from_dynamo(body)
    
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "message": "Successfully deleted doc!"
        }),
    }
    
def delete_from_dynamo(body):
    
    response = dynamodb.delete_item(
        TableName=table_name,
        Key={ 'id': {'S': body['id']} }
    )
    
    s3.delete_object(
        Bucket=bucket_name,
        Key=body['name']
    )
