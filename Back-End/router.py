from flask import request, jsonify
from database import Database
from validate import *

db = Database('localhost', 3306, 'root', 'filepedia')

def Router(app):
  @app.route('/register', methods = ['POST'])
  def register():
    data = request.json
    username = data['username']
    password = data['password']

    if not (res := validate_username(username)): return jsonify({'status': 0, 'error': str(res)})
    if not (res := validate_password(password)): return jsonify({'status': 0, 'error': str(res)})
    
    res = db.register(username, password)
    if res: return jsonify({'status': 1})
    else: return jsonify({'status': 0, 'error': 'User already exists'})

  @app.route('/login', methods = ['POST'])
  def login():
    data = request.json
    username = data['username']
    password = data['password']
    
    res = db.login(username, password)
    if res: return jsonify({'status': 1, 'account': res})
    else: return jsonify({'status': 0, 'error': 'Wrong credentials'})

  @app.route('/publish', methods = ['POST'])
  def publish():
    data = request.json
    title = data['title']
    subtitle = data['subtitle']
    body = data['body']
    author = data['author']
    
    id = db.new_post(title, subtitle, body, author)
    return jsonify({'status': 1, 'id': id})

  @app.route('/delete-post', methods = ['POST'])
  def delete_post():
    data = request.json
    id = data['id']
    
    id = db.delete_post(id)
    return jsonify({'status': 1})

  @app.route('/post', methods = ['POST'])
  def post():
    data = request.json
    id = data['id']
    
    res = db.get_post(id)
    if res: return jsonify({'status': 1, 'post': res})

  @app.route('/get-posts', methods = ['POST'])
  def get_posts():
    data = request.json
    searching = data.get('searching', '')
    username = data.get('username', '')
    limit = data.get('limit', 10)
    offset = data.get('offset', 0)

    res = db.get_posts(searching, username, limit, offset)
    if res: return jsonify({'status': 1, 'posts': res})
    else: return jsonify({'status': 0})
