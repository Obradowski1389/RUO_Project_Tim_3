import json
import boto3

table_name = "Sharing"
dynamodb = boto3.client('dynamodb')
client = boto3.client("ses", region_name='eu-central-1')

def return_error(message, statusCode):
    return {
        "statusCode": statusCode,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "message": message
        }),
    }

def get_invite(event):
    body = json.loads(event['body'])
    email = body['targetEmail']
    sender = body["senderEmail"]

    params = {
        'TableName': table_name,
        'FilterExpression': '#attr1 = :val1 AND #attr2 = :val2',
        'ExpressionAttributeNames': {
            '#attr1': 'targetEmail',
            '#attr2': 'senderEmail'
        },
        'ExpressionAttributeValues': {
            ':val1': {'S': email},
            ':val2': {'S': sender}
        }
    }

    response = dynamodb.scan(**params)
    print("Response: ", str(response))

    if 'Items' in response and len(response['Items']) > 0:
        item = response['Items'][0]
        if item.get("status") == {"S": "PENDING"}:
            return item
        else:
            return None
    else:
        return None
    

def update_invite_info(email, username, accepted):

    update_expression = 'SET #attr = :val'
    expression_attribute_names = {'#attr': "status"}
    if(accepted):
        expression_attribute_values = {':val': {'S': "ACCEPTED"}}
    else:
        expression_attribute_values = {":val": {'S': "DECLINED"}}
    condition_expression = '#condAttr = :condVal'
    expression_attribute_names['#condAttr'] = "senderEmail"
    expression_attribute_values[':condVal'] = {'S': username}

    try:
        response = dynamodb.update_item(
            TableName=table_name,
            Key={"targetEmail": {'S': email}},
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_attribute_names,
            ExpressionAttributeValues=expression_attribute_values,
            ConditionExpression=condition_expression
        )
    except Exception as e:
        print("Error: ", e)
        raise e
    
def send_email(event, accepted):
    body = json.loads(event["body"])
    targetEmail = body["targetEmail"]
    senderEmail = body["senderEmail"]

    subject = "Cloud Storage Sharing Notification"
    if(accepted):
        body = f"User {targetEmail} has accepted your invite! Now your storage is being shared with them. You can cancel this sharing at any time"
    else: 
        body = f"User {targetEmail} has declined your invite for sharing your storage."

    message = {"Subject": {"Data": subject}, "Body": {"Html": {"Data": body}}}
    try:

        response = client.send_email(            
            Source="isomidobradovic@gmail.com", Destination={"ToAddresses": [senderEmail]}, Message=message)
        
        return {
            "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "message": "Successfully sent!"
                }),
        }
    except Exception as e:
        print("Error:", e)
        return return_error("Error: Failed to send email to inviter.", 500)


def resolve_invite(event, context):
    body = json.loads(event['body'])

    accept = bool(body["accept"])

    item = get_invite(event)
    if item is None:
        return return_error("Invitation for these users not found or has already been accepted.", 404)
    try:
        update_invite_info(body["targetEmail"], body["senderEmail"], accept)
        send_email(event, accept)
    except Exception as e:
        print("Error: ", e)
        return return_error("There was a problem with accepting invite", 500)
    
    return {
        "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": "Invite accepted!"
            }),
        }

    

    

