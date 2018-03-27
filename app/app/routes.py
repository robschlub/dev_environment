# from flask import Flask, render_template
# from app.util import assets

# app = Flask(__name__)


# @app.route('/')
# def hello_world():
#     return render_template('index.html')


from flask import render_template
from app import app


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/introduction')
def introduction():
    return render_template('introduction.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/favicon.ico')
def icon():
    return app.send_static_file('favicon.ico')


@app.route('/apple-touch-icon-precomposed.png')
@app.route('/apple-touch-icon.png')
def apple_touch_icon():
    return app.send_static_file('icon.png')
