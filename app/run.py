# run.py

from flask import Flask, current_app
from init_db import init_db
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

@app.before_first_request
def initialize_db():
    """애플리케이션 시작 시 데이터베이스 초기화"""
    db = init_db()
    current_app.db = db  # 애플리케이션 컨텍스트에 DB 객체를 할당

@app.route('/')
def home():
    return "Flask with MongoDB initialized!"

if __name__ == "__main__":
    app.run(debug=True)
