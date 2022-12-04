import datetime
import json
import socket

##################
# Data accept
#
# IDataMessageGET
# IDataMessagePUT
# IDataMessagePOST
#
##################
USER = {
    "address_ip": "",
    "name": "",
    "image": "",
    "password": ""
}


def dataFormat(template, **kwargs):
    idd = []
    convert_t = []
    data = kwargs['data']
    if len(data) >= 1:
        template = list(template.keys())

        for i in data:
            aux = list(i)
            aux.pop(0)
            convert_t.append(aux)

        for i in convert_t:
            x_data = {}
            for x in range(len(template)):
                x_data[template[x]] = i[x]
            idd.append(x_data)
        return idd
    return ['Data not found']


class Server:
    HOST_CONNECT = "127.0.0.1"
    SIZE_MSG = 103400
    LIST_MESSAGE = []

    def __init__(self, address_host, port_host, connector):
        self.LIST_MESSAGE = []
        self.connect = socket.socket()
        self.connect.bind((address_host, port_host))
        self.connect.listen(2)
        self.connector_bd = connector

    def authentication(self, dataAuth):
        try:
            data = dataAuth['data']
            self.connector_bd.mount_query(table='tb_user', where='name = "{}"'.format(data['email']))
            result = self.connector_bd.submit_query()
            if result['status'] == 404:
                return ['Verify your fields!']
            result = dataFormat(USER, data=result['data'])[0]
            if result['name'] == data['email'] and result['password'] == data['password']:
                return result
            return ['Credential invalid!']
        except Exception as e:
            return ['Error unexpected!']

    def validationMessage(self, typeRequest, flag):
        if flag == 'Auth':
            return False
        else:
            if typeRequest == "GET":
                self.connector_bd.mount_query(table='tb_{}'.format(str(flag).lower()))
                result = self.connector_bd.submit_query()
                result = dataFormat(USER, data=result['data'])
                return result
            elif typeRequest == 'POST':
                print('Method POST')
            elif typeRequest == 'PUT':
                print('Method PUT')

    def listenMessage(self):
        conn, address = self.connect.accept()
        dataMsa = json.loads(conn.recv(self.SIZE_MSG).decode('utf-8'))
        data = self.validationMessage(dataMsa['type'], dataMsa['flag'])

        if data:
            print("from connected user: " + address[0] + " - " + dataMsa['type'])
            self.registerLog(str(address[0]), dataMsa['type'], 'Receive request')
        else:
            data = self.authentication(dataMsa)
        conn.send(json.dumps(data).encode())
        conn.close()

    def getMessages(self):
        return self.LIST_MESSAGE

    def registerLog(self, user='', typeRequest='', message=''):
        with open('./logs/connection.log', 'a') as f:
            dateNow = datetime.datetime.now()
            log = '[' + str(dateNow.now()) + ', {}] - Request with {}\n'.format(user, typeRequest, message)

            f.write(str(log))

        f.close()
