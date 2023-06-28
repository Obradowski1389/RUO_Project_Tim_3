from typing import Any
import boto3
import json
import base64
from datetime import datetime
from decimal import Decimal


bucket_name = 'files-cloud-back'
table_name = 'metadata-cloud-back'
s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table_name = 'metadata-cloud-back'


class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)


class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime, Decimal)):
            return str(obj)
        return super().default(obj)



def download_all_files(event, context):
    body = json.loads(event['body'])
    try:
        folder_id, fn = body['id'].split('/', 1)
        folder_id += '/'

        all_files = s3.list_objects_v2(Bucket=bucket_name, Prefix=folder_id)

        for_download = []
        for obj in all_files['Contents']:
            if fn in obj['Key']:
                for_download.append(obj['Key'])

        # for_download = json.dumps(for_download, cls=DateTimeEncoder)
        dict = {}
        for fn in for_download:
            type = get_type_from_dynamo(fn, folder_id)
            dict[fn] = type

    except Exception as e:
        print("Error downloading file:", e)
    
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "files": dict,
            "message": f"Successfully downloaded all file names for folder."
        }, cls=CustomEncoder),
    }


def get_type_from_dynamo(file_name, folder_id):
    folder_id = folder_id.split('/')[0]
    try:
        response = dynamodb.Table(table_name).scan(
            FilterExpression='begins_with(#key, :prefix)',
            ExpressionAttributeNames={'#key': 'name'},
            ExpressionAttributeValues={':prefix': folder_id})
        for item in response['Items']:
            if file_name in item['name']:
                return item['type']

    except Exception as e:
        print(f"Error while handling types: {e}")

