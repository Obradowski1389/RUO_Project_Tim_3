import boto3
import json

table_name = 'metadata-cloud-back'
bucket_name = 'files-cloud-back'
dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

def move(event, context):
    body = json.loads(event['body'])
    
    old_name, is_folder = move_in_dynamo(body)
    if not is_folder:
        move_in_s3 (old_name, body)
    
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "message": "Successfully moved doc!"
        }),
    }
    
def move_in_dynamo(body):
    table = dynamodb.Table(table_name)
    #get file for move
    response = table.get_item(Key={ 'id': body['id'] })
    #save neccessary fields
    item = response['Item']
    old_name = item['name']
    is_folder = item['isFolder']
    #move
    item['name'] = body['name']
    response = table.put_item(Item=item)
    return old_name, is_folder

def move_in_s3(old_name, body):
    #make same object with new name
    s3.copy_object(
    Bucket=bucket_name,
    Key=body['name'],
    CopySource={
        'Bucket': bucket_name,
        'Key': old_name
    })
    #delete old object
    s3.delete_object(
        Bucket=bucket_name,
        Key=old_name
    )