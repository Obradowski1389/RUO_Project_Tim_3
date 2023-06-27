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
    sender = body["senderUsername"]

    params = {
        'TableName': table_name,
        'FilterExpression': '#attr1 = :val1 AND #attr2 = :val2',
        'ExpressionAttributeNames': {
            '#attr1': 'targetEmail',
            '#attr2': 'senderUsername'
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
        if item.get("status") == "CREATED":
            return item
        else:
            return None
    else:
        return None
    

def update_invite_info(email, username):

    update_expression = 'SET #attr = :val'
    expression_attribute_names = {'#attr': "status"}
    expression_attribute_values = {':val': {'S': "ACCEPTED"}}
    condition_expression = '#condAttr = :condVal'
    expression_attribute_names['#condAttr'] = "senderUsername"
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

def accept_invite(event, context):
    body = json.loads(event['body'])

    item = get_invite(event)
    if item is None:
        return return_error("Invitation for these users not found or has already been accepted.", 404)
    try:
        update_invite_info(body["targetEmail"], body["senderUsername"])
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

    

    

