import boto3
import json
import base64


bucket_name = 'files-cloud-back'
s3 = boto3.client('s3')

def download_from_s3(event, context):
    body = json.loads(event['body'])
    try:
        
        response = s3.get_object(Bucket=bucket_name, Key=body['name'])
        value_encoded = base64.b64encode(response['Body'].read()).decode('utf-8')

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "value": value_encoded,
                "message": "Successfully downloaded doc!"
            }),
        }
    
    except Exception as e:
        print("Error:", e)
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": "Error: Failed to download the file. Please try again later."
            }),
        }
