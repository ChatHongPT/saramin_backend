from flask import Flask
from flask_jwt_extended import JWTManager
from .models import init_db
from .extensions import init_jwt
from .controllers import job_routes
from .crawlers.saramin_crawler import crawl_saramin
import threading
from flasgger import Swagger

swagger = Swagger(app)


app = Flask(__name__)
app.config.from_object('config.Config')

# Initialize extensions
init_db(app)
init_jwt(app)

# Register Blueprints
app.register_blueprint(job_routes, url_prefix='/api')

# Run the crawler in the background (could be scheduled as a cron job or triggered manually)
def run_crawler():
    crawl_saramin(pages=5)

# Start the crawler on server startup
@app.before_first_request
def before_first_request():
    threading.Thread(target=run_crawler).start()

if __name__ == '__main__':
    app.run(debug=True)
