import json
from flask import Flask
from web3 import Web3
from flask_restplus import Api, Resource, fields

# web3.py instance
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
w3.eth.defaultAccount = w3.eth.accounts[1]

# Get stored abi and contract_address
with open("data.json", 'r') as f:
    datastore = json.load(f)
    abi = datastore["abi"]
    contract_address = datastore["contract_address"]


# Initializing flask app
app = Flask(__name__)
api = Api(app, version='1.0', title='User API',
    description='A simple User API',
)
ns = api.namespace('users', description='user operations')
# api to set new user every api call

user = api.model('User', {
    'name': fields.String(),
    'gender': fields.String()
})

@ns.route('/')
class UserList(Resource):
    @ns.expect(user)
    def get(self):
        user = w3.eth.contract(address=contract_address, abi=abi)
        body = api.payload
        tx_hash = user.functions.getUser(

        ).transact()
        receipt = w3.eth.waitForTransactionReceipt(tx_hash)
        user_data = user.functions.getUser().call()
        return {"data": user_data}, 200


    @ns.expect(user)
    def post(self):
        user = w3.eth.contract(address=contract_address, abi=abi)
        body = api.payload
        tx_hash = user.functions.setUser(
            body['name'], body['gender']
        ).transact()
        receipt = w3.eth.waitForTransactionReceipt(tx_hash)
        user_data = user.functions.getUser().call()
        return {"data": user_data}, 200

# def user():
#     # Create the contract instance with the newly-deployed address
#     user = w3.eth.contract(address=contract_address, abi=abi)
#     body = request.get_json()
#     result = UserSchema().load(body)
#     tx_hash = user.functions.setUser(
#         result['name'],result['gender']
#     ).transact()
#     # Wait for transaction to be mined...
#     receipt = w3.eth.waitForTransactionReceipt(tx_hash)
#     user_data = user.functions.getUser().call()
#     return jsonify({"data": user_data}), 200
