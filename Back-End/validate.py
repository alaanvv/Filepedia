def validate_username(username):
    class Err:
        def __init__(self, value):
            self.value = value
        def __str__(self):
            return self.value
        def __bool__(self):
            return False
        
    if len(username) < 3:
        return Err('Your username needs at least 3 characters')
    
    return 1

def validate_password(password):
    class Err:
        def __init__(self, value):
            self.value = value
        def __str__(self):
            return self.value
        def __bool__(self):
            return False
        
    if len(password) < 5:
        return Err('Your password needs at least 6 characters')
    
    return 1