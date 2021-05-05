from marshmallow import Schema, fields
from pprint import pprint

def check_gender(data):
    valid_list = ["male", "female"]
    if data not in valid_list:
        raise ValidationError(
            'Invalid gender. Valid choices are'+ valid_list
        )

class UserSchema(Schema):
    name = fields.String(required=True)
    gender = fields.String(required=True, validate=check_gender)

# class UserSchema1(Schema):
#     name = fields.Str()
#     email = fields.Email()
#     created_at = fields.DateTime()


body = {
    "name": "John Doe",
    "gender": "female"
}

# user_data = {
#     "created_at": "2014-08-11T05:26:03.869245",
#     "email": "ken@yahoo.com",
#     "name": "Ken",
# }
# schema = UserSchema1()
# result = schema.load(user_data)
# pprint(result)
result, error = UserSchema().load(body)
pprint(result)
pprint(error)
