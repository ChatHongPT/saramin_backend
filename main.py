from flask import Flask, send_from_directory
from flask_swagger_ui import get_swaggerui_blueprint
import os

app = Flask(__name__)

# Swagger 설정
SWAGGER_URL = '/swagger'
API_URL = '/swagger.yaml'  # 절대 경로를 설정
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={'app_name': "WSD Assignment API"}
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

# Swagger YAML 파일 경로
@app.route('/swagger.yaml')
def swagger_file():
    """app/ 폴더에 있는 swagger.yaml 파일 제공"""
    return send_from_directory(os.path.join(app.root_path, 'app'), 'swagger.yaml')

@app.route("/", methods=["GET"])
def home():
    return {"message": "Welcome to the API!"}, 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
