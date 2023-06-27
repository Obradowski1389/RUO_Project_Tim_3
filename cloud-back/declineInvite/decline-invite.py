import json
import boto3

table_name = "Sharing"
dynamodb = boto3.client('dynamodb')
client = boto3.client("ses", region_name='eu-central-1')

def decline_invite(event, context):
    body = json.loads(event["body"])
    targetEmail = body["targetEmail"]
    senderEmail = body["senderEmail"]


    pass