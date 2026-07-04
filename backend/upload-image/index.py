import base64
import json
import os
import uuid

import boto3
import psycopg2


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def is_authorized(event: dict) -> bool:
    req_headers = event.get('headers', {}) or {}
    auth_header = req_headers.get('X-Authorization') or req_headers.get('x-authorization') or ''
    token = auth_header.replace('Bearer ', '').strip()
    if not token:
        return False

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "SELECT user_id FROM sessions WHERE token = %s AND expires_at > NOW()",
        (token,),
    )
    row = cur.fetchone()
    cur.close()
    conn.close()
    return row is not None


def handler(event: dict, context) -> dict:
    '''Загрузка изображения (аватар, баннер, рамка) в S3-хранилище, возвращает публичный CDN-URL'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    if method != 'POST':
        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}

    if not is_authorized(event):
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Unauthorized'})}

    body = json.loads(event.get('body') or '{}')
    image_base64 = body.get('image')
    content_type = body.get('contentType', 'image/png')
    kind = body.get('kind', 'avatar')

    if not image_base64:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'image is required'})}

    if ',' in image_base64:
        image_base64 = image_base64.split(',', 1)[1]

    image_data = base64.b64decode(image_base64)

    ext = 'png'
    if 'jpeg' in content_type or 'jpg' in content_type:
        ext = 'jpg'
    elif 'webp' in content_type:
        ext = 'webp'
    elif 'gif' in content_type:
        ext = 'gif'

    file_name = f"profile/{kind}/{uuid.uuid4().hex}.{ext}"

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=file_name, Body=image_data, ContentType=content_type)

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_name}"

    return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'url': cdn_url})}
