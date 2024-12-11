from flask import Flask
from app.routes import auth, jobs, apps, bookmarks, resumes

app = Flask(__name__)

# 블루프린트 등록
app.register_blueprint(auth.bp, url_prefix="/auth")
app.register_blueprint(jobs.bp, url_prefix="/jobs")
app.register_blueprint(apps.bp, url_prefix="/apps")
app.register_blueprint(bookmarks.bp, url_prefix="/bookmarks")
app.register_blueprint(resumes.bp, url_prefix="/resumes")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
