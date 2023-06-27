import boto3
import json
import base64


bucket_name = 'files-cloud-back'
s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table_name = 'metadata-cloud-back'


def download_all_files(event, context):
    body = json.loads(event['body'])
    folder_id = body['id']
    files = get_files_in_folder(folder_id)
    downloaded_files = []
    
    for file in files:
        try:
            response = s3.get_object(Bucket=bucket_name, Key=file['name'])
            value_encoded = base64.b64encode(response['Body'].read()).decode('utf-8')
            downloaded_files.append({
                'name': file['name'],
                'value': value_encoded
            })
        except Exception as e:
            print("Error downloading file:", file['name'], "-", e)
    
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "files": downloaded_files,
            "message": "Successfully downloaded all files from the folder."
        }),
    }


def get_files_in_folder(folder_id):
    table = dynamodb.Table(table_name)
    response = table.scan(
        FilterExpression=boto3.dynamodb.conditions.Attr('isFolder').eq(False)
                         & boto3.dynamodb.conditions.Attr('folderId').eq(folder_id)
    )
    files = response.get('Items', [])
    return files
