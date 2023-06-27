import boto3
import json

table_name = "Sharing"
dynamodb = boto3.client('dynamodb')

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
            ':val1': {"S":email},
            ':val2': {"S":sender}
        }
    }

    response = dynamodb.scan(**params)

    if 'Items' in response and len(response['Items']) > 0:
        item = response['Items'][0]
        return item
    else:
        return None
    
    
def update_invite_info(event):
    body = json.loads(event['body'])
    email = body['targetEmail']
    username = body["senderUsername"]
    revoke = bool(body["revoke"])

    update_expression = 'SET #attr = :val'
    expression_attribute_names = {'#attr': "status"}
    if(revoke):
        expression_attribute_values = {':val': {'S': "REVOKED"}}
    else:
        expression_attribute_values = {":val": {'S': "ACCEPTED"}}
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

def modify_invitation(event, context):
    invitation = get_invite(event)

    if invitation is None:
        return {
            "statusCode": 404,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": "Invitation not found"
        }),
    }

    try:
        update_invite_info(event)
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": "Error: unable to update invitation. Please try again later"
        }),
    }

    return {
        "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": "Invite revoked."
            }),
        }



