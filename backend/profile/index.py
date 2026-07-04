import json
import os

import psycopg2
from psycopg2.extras import RealDictCursor


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def get_user_id_by_token(cur, token: str):
    cur.execute(
        "SELECT user_id FROM sessions WHERE token = %s AND expires_at > NOW()",
        (token,),
    )
    row = cur.fetchone()
    return row['user_id'] if row else None


def handler(event: dict, context) -> dict:
    '''Получение и обновление профиля пользователя: ник, цвет ника, аватар, баннер, рамка, медали'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    req_headers = event.get('headers', {}) or {}
    auth_header = req_headers.get('X-Authorization') or req_headers.get('x-authorization') or ''
    token = auth_header.replace('Bearer ', '').strip()

    if not token:
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'No token'})}

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    user_id = get_user_id_by_token(cur, token)
    if not user_id:
        cur.close()
        conn.close()
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Invalid or expired session'})}

    if method == 'GET':
        cur.execute(
            "SELECT nickname, nickname_color, avatar_url, banner_url, frame_url, medals "
            "FROM profiles WHERE user_id = %s",
            (user_id,),
        )
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Profile not found'})}

        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(dict(row))}

    if method in ('POST', 'PUT'):
        body = json.loads(event.get('body') or '{}')

        allowed_fields = ['nickname', 'nickname_color', 'avatar_url', 'banner_url', 'frame_url', 'medals']
        updates = []
        values = []
        for field in allowed_fields:
            if field in body:
                updates.append(f"{field} = %s")
                values.append(json.dumps(body[field]) if field == 'medals' else body[field])

        if not updates:
            cur.close()
            conn.close()
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'No fields to update'})}

        values.append(user_id)
        query = f"UPDATE profiles SET {', '.join(updates)}, updated_at = NOW() WHERE user_id = %s"
        cur.execute(query, values)
        conn.commit()

        cur.execute(
            "SELECT nickname, nickname_color, avatar_url, banner_url, frame_url, medals "
            "FROM profiles WHERE user_id = %s",
            (user_id,),
        )
        row = cur.fetchone()
        cur.close()
        conn.close()

        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(dict(row))}

    cur.close()
    conn.close()
    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}
