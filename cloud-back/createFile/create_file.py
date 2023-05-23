import boto3
import json

table_name = 'FileMetaDataTable'
dynamodb = boto3.resource('dynamodb')

def create(event, context):
    save_in_dynamo(event)
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "message": "Successfully created doc!"
        }),
    }
    
def save_in_dynamo(event):
    body = json.loads(event['body'])
    table = dynamodb.Table(table_name)
    table.put_item(
        Item = {
            'name' : body['name'],
            'type' : body['type'],
            'isFolder' : body['isFolder'],
            'size' : body['size'],
            'createDate' : body['createDate'],
            'lastModifyDate' : body['lastModifyDate'],
            'description' : body['description'],
            'tags' : body['tags']
        }
    )