import socket
import json
import sys


class Cliente:
    def __init__(self):
        self.connect = socket.socket()

    def sendMessage(self, message, address_connect, port_connect):
        self.connect.connect((address_connect, port_connect))
        # host_ip = bytearray(address_connect, "ascii")
        self.connect.send(json.dumps(message).encode())
        data = json.loads(self.connect.recv(100000).decode('utf-8'))
        self.connect.close()
        return data
