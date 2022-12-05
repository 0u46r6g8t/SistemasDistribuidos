#!/usr/share/python
from services.server import Server
from services.sql_connection import MysqlConnection


def mainServer():
    connector = MysqlConnection()
    serverMain = Server('127.0.0.1', 11000, connector)

    while True:
        if serverMain:
            serverMain.listenMessage()


# Try exception error
try:
    mainServer()
except TypeError as e:
    print(e)
    print("Verify your params")
except KeyboardInterrupt:
    print("\nThank you for using our app!!!")
