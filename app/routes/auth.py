from flask import Blueprint, request, jsonify
from app.utils.db import get_db_connection
from app.utils.jwt import generate_jwt, verify_jwt
import bcrypt
import base64
import pymongo

# Blueprint 설정
auth_bp = Blueprint('auth', __name__)

# MongoDB 설정
client = get_db_connection()
db = client["job_db"]
users_collection = db["users"]

@auth_bp.route('/auth/register', methods=['POST'])
def register():
    """
    회원 가입 API
    """
    data = request.json

    email = data.get("email")
    password = data.get("password")
    username = data.get("username")

    if not email or not password or not username:
        return jsonify({"error": "필수 필드가 누락되었습니다."}), 400

    if "@" not in email:
        return jsonify({"error": "유효하지 않은 이메일 형식입니다."}), 400

    # 비밀번호 암호화
    hashed_password = base64.b64encode(bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())).decode('utf-8')

    # 중복 회원 검사
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "이미 등록된 이메일입니다."}), 409

    # 사용자 정보 저장
    user = {
        "email": email,
        "password": hashed_password,
        "username": username
    }
    users_collection.insert_one(user)

    return jsonify({"message": "회원 가입 성공."}), 201

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """
    로그인 API
    """
    data = request.json

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "필수 필드가 누락되었습니다."}), 400

    # 사용자 인증
    user = users_collection.find_one({"email": email})
    if not user or not bcrypt.checkpw(password.encode('utf-8'), base64.b64decode(user["password"])):
        return jsonify({"error": "이메일 또는 비밀번호가 잘못되었습니다."}), 401

    # JWT 토큰 발급
    token = generate_jwt({"email": email})

    return jsonify({"message": "로그인 성공.", "token": token}), 200

@auth_bp.route('/auth/refresh', methods=['POST'])
def refresh_token():
    """
    토큰 갱신 API
    """
    data = request.json
    refresh_token = data.get("refresh_token")

    if not refresh_token or not verify_jwt(refresh_token):
        return jsonify({"error": "유효하지 않은 토큰입니다."}), 401

    new_token = generate_jwt({"email": verify_jwt(refresh_token)["email"]})

    return jsonify({"message": "토큰 갱신 성공.", "token": new_token}), 200

@auth_bp.route('/auth/profile', methods=['PUT'])
def update_profile():
    """
    회원 정보 수정 API
    """
    data = request.json
    email = data.get("email")
    new_password = data.get("new_password")
    new_username = data.get("new_username")

    if not email:
        return jsonify({"error": "이메일이 필요합니다."}), 400

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "사용자를 찾을 수 없습니다."}), 404

    update_data = {}
    if new_password:
        update_data["password"] = base64.b64encode(bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())).decode('utf-8')
    if new_username:
        update_data["username"] = new_username

    users_collection.update_one({"email": email}, {"$set": update_data})

    return jsonify({"message": "회원 정보 수정 성공."}), 200

@auth_bp.route('/auth/delete', methods=['DELETE'])
def delete_account():
    """
    회원 탈퇴 API
    """
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "이메일이 필요합니다."}), 400

    result = users_collection.delete_one({"email": email})
    if result.deleted_count == 0:
        return jsonify({"error": "사용자를 찾을 수 없습니다."}), 404

    return jsonify({"message": "회원 탈퇴 성공."}), 200
