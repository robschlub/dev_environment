# from flask import Flask, render_template
# from app.util import assets

# app = Flask(__name__)


# @app.route('/')
# def hello_world():
#     return render_template('index.html')


from flask import render_template
from app import app

@app.route('/')
def index():
    return render_template('index.html')
