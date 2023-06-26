import boto3
import json

table_name = 'metadata-cloud-back'
bucket_name = 'files-cloud-back'
dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

def delete_one_file(event, context):
    body = json.loads(event['body'])
    if body['isFolder']:
        delete_folder(body)
    else:
        delete_file(body['id'], body['name'])

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "message": "Successfully deleted doc!"
        }),
    }
    
def delete_file(id: str, name: str):
    temp = s3.get_object(Bucket=bucket_name, Key=name)
    s3.delete_object(Bucket=bucket_name, Key=name)
    try:
        dynamodb.Table(table_name).delete_item(Key={ 'id': id })
    except:
        s3.put_object(Body=temp, Bucket=bucket_name, Key=name)



def delete_folder(body):
    #find all files
    prefix = body['name']
    response = dynamodb.Table(table_name).scan(
        FilterExpression='begins_with(#key, :prefix)',
        ExpressionAttributeNames={'#key': 'name'},
        ExpressionAttributeValues={':prefix': prefix}
    )
    #delete all files
    items = response['Items']
    for item in items:
        delete_file(item['id'], item['name'])