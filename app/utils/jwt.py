import jwt
from datetime import datetime, timedelta

# JWT 설정
SECRET_KEY = "WSD-Assignment-03"  # 반드시 안전한 키로 변경하세요.
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15  # Access Token 만료 시간
REFRESH_TOKEN_EXPIRE_DAYS = 7  # Refresh Token 만료 시간

def generate_jwt(data, token_type="access"):
    """
    JWT 토큰을 생성하는 함수.

    Args:
        data (dict): 토큰에 포함할 데이터.
        token_type (str): "access" 또는 "refresh".

    Returns:
        str: 생성된 JWT 토큰.
    """
    now = datetime.utcnow()
    expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES) if token_type == "access" else now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    payload = {
        "data": data,
        "type": token_type,
        "iat": now,
        "exp": expire
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_jwt(token):
    """
    JWT 토큰을 검증하는 함수.

    Args:
        token (str): 검증할 JWT 토큰.

    Returns:
        dict: 토큰의 payload 데이터.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired.")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token.")

def token_required(func):
    """
    인증 미들웨어 데코레이터.

    Args:
        func (function): 보호할 함수.

    Returns:
        function: 데코레이터가 적용된 함수.
    """
    from functools import wraps
    from flask import request, jsonify

    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Authorization header is required."}), 401

        token = auth_header.split(" ")[1] if " " in auth_header else auth_header

        try:
            payload = verify_jwt(token)
            request.user = payload["data"]
        except ValueError as e:
            return jsonify({"error": str(e)}), 401

        return func(*args, **kwargs)

    return wrapper
