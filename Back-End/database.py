import pymysql

class Database:
    # Must ping always, because I'm using a global connection
    def __init__(self, host, port, user, db, password):
        self.connection = pymysql.connect(host = host, port = port, user = user, db = db, password = password)
        self.cursor = self.connection.cursor()
        create_users_table = """
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        create_posts_table = """
        CREATE TABLE IF NOT EXISTS posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            subtitle VARCHAR(255),
            body TEXT NOT NULL,
            author VARCHAR(255) NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        self.cursor.execute(create_users_table)
        self.cursor.execute(create_posts_table)
        self.connection.commit()

    # Account
    def register(self, username, password):
      self.connection.ping()
      # Check if the user already exists
      self.cursor.execute("SELECT * FROM users WHERE username = %s", (username))
      if self.cursor.fetchone(): return 0
      
      # Creates new user
      self.cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, password))
      
      self.connection.commit()
      self.connection.close()
      
      return 1
    
    def login(self, username, password):
      self.connection.ping()

      self.cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
      user = self.cursor.fetchone()
    
      return user[0] if user else 0
   
    # Post
    def new_post(self, title, subtitle, body, author):
      self.connection.ping()

      self.cursor.execute("INSERT INTO posts (title, subtitle, body, author, timestamp) VALUES (%s, %s, %s, %s, NOW())", (title, subtitle, body, author))

      self.connection.commit()
      self.connection.close()
      
      return self.cursor.lastrowid
   
    def delete_post(self, id):
      self.connection.ping()

      self.cursor.execute('DELETE FROM posts WHERE id = %s', (id))

      self.connection.commit()
      self.connection.close()
      
      return self.cursor.lastrowid
    
    def get_post(self, id):
      self.connection.ping()

      self.cursor.execute("SELECT * FROM posts WHERE id = %s", (id))
      return self.cursor.fetchone()
        
    def get_posts(self, searching, username, limit, offset):
      self.connection.ping()

      args = [f'%{searching}%', limit, offset]
      if username: args.insert(1, username)

      self.cursor.execute(f'SELECT * FROM posts WHERE body LIKE %s {"AND author = %s" if username else ""} ORDER BY id DESC LIMIT %s OFFSET %s', args)
      return self.cursor.fetchall()
    
