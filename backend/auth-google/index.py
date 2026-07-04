import json
import os
import secrets
import urllib.request
from datetime import datetime, timedelta

import psycopg2


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def verify_google_token(id_token: str) -> dict:
    '''Verify Google ID token via Google tokeninfo endpoint and return payload'''
    url = f'https://oauth2.googleapis.com/tokeninfo?id_token={id_token}'
    with urllib.request.urlopen(url, timeout=10) as resp:
        payload = json.loads(resp.read().decode())
    client_id = os.environ.get('GOOGLE_CLIENT_ID', '')
    if payload.get('aud') != client_id:
        raise ValueError('Invalid audience')
    return payload


def handler(event: dict, context) -> dict:
    '''Авторизация пользователя через Google ID Token: создаёт аккаунт при первом входе, выдаёт сессионный токен'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        id_token = body.get('credential')
        if not id_token:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'credential is required'})}

        try:
            payload = verify_google_token(id_token)
        except Exception:
            return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Invalid Google token'})}

        google_id = payload.get('sub')
        email = payload.get('email', '')
        name = payload.get('name', '')

        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT id FROM users WHERE google_id = %s", (google_id,))
        row = cur.fetchone()

        if row:
            user_id = row[0]
        else:
            cur.execute(
                "INSERT INTO users (google_id, email, name) VALUES (%s, %s, %s) RETURNING id",
                (google_id, email, name),
            )
            user_id = cur.fetchone()[0]
            cur.execute(
                "INSERT INTO profiles (user_id, nickname) VALUES (%s, %s)",
                (user_id, name),
            )

        token = secrets.token_hex(32)
        expires_at = datetime.utcnow() + timedelta(days=30)
        cur.execute(
            "INSERT INTO sessions (token, user_id, expires_at) VALUES (%s, %s, %s)",
            (token, user_id, expires_at),
        )
        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'token': token, 'user_id': user_id, 'email': email, 'name': name}),
        }

    if method == 'GET':
        query_params = event.get('queryStringParameters') or {}
        if query_params.get('config') == '1':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'clientId': os.environ.get('GOOGLE_CLIENT_ID', '')}),
            }

        req_headers = event.get('headers', {}) or {}
        auth_header = req_headers.get('X-Authorization') or req_headers.get('x-authorization') or ''
        token = auth_header.replace('Bearer ', '').strip()
        if not token:
            return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'No token'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "SELECT u.id, u.email, u.name FROM sessions s JOIN users u ON u.id = s.user_id "
            "WHERE s.token = %s AND s.expires_at > NOW()",
            (token,),
        )
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Invalid or expired session'})}

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'user_id': row[0], 'email': row[1], 'name': row[2]}),
        }

    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}