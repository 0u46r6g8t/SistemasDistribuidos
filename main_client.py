#!/usr/share/python
from utils.functions import FunctionUtils
from services.client import Cliente as Client
from flask import Flask, request

HOST_IP = '127.0.0.1'
HOST_PORT = 11000
app = Flask("Client chat")
functions = FunctionUtils()


@app.route("/user", methods=["GET"])
def getUsers():
    global dataUser
    try:
        mainClient = Client()
        if mainClient:
            # Get data
            # data = request.args.to_dict()
            dataFunction = functions.interface_data(flag='User', typeRequest='GET')
            dataUser = mainClient.sendMessage(dataFunction, HOST_IP, HOST_PORT)

        return functions.message_return(message="Success", status=200, response=dataUser)
    except KeyError:
        return functions.message_return("", 404, "Verify type of parameters")
    except TypeError:
        return functions.message_return("", 404, "Verify type of parameters")


@app.route("/group", methods=["GET"])
def getGroups():
    global dataResponse
    try:
        mainClient = Client()
        if mainClient:
            # Get data
            # data = request.args.to_dict()
            dataFunction = functions.interface_data(flag='Group', typeRequest='GET')
            dataResponse = mainClient.sendMessage(dataFunction, HOST_IP, HOST_PORT)

        return functions.message_return(message="Success", status=200, response=dataResponse)
    except KeyError:
        return functions.message_return("", 404, "Verify type of parameters")
    except TypeError:
        return functions.message_return("", 404, "Verify type of parameters")


@app.route("/chat", methods=["GET"])
def getMessageChat():
    return "Messages"


@app.route("/auth", methods=["POST"])
def auth():
    global dataResponse
    try:
        mainClient = Client()
        if mainClient:
            # Get data
            dataQuery = request.args.to_dict()
            if 'email' in dataQuery and 'password' in dataQuery:
                dataFunction = functions.interface_data(flag='Auth', typeRequest='POST', data=dataQuery)
                dataResponse = mainClient.sendMessage(dataFunction, HOST_IP, HOST_PORT)
                return functions.message_return(message="Success", status=200, response=dataResponse)
            else:
                return functions.message_return(message="Error", status=404, response="Verify your fields")
    except KeyError:
        return functions.message_return("", 404, "Verify type of parameters")
    except TypeError:
        return functions.message_return("", 404, "Verify type of parameters")


app.run(debug=True)
