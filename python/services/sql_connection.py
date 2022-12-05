import mysql.connector
from mysql.connector import Error
from datetime import datetime, timedelta

from utils.functions import FunctionUtils


class MysqlConnection:
    def __init__(self):
        self.connector = mysql.connector.connect(user='root', password='password', host='localhost', database='sakila', port=3306)
        self.query = ''
        self.functionAux = FunctionUtils()

    def getCursor(self):
        return self.connector.cursor(buffered=True)

    def getConnection(self):
        return self.connector

    def getDate(self):
        return datetime.now().date() + timedelta(days=1)

    def mount_query(self, table='', fields='', where=''):
        try:
            if fields:
                self.query = ('select ' + fields + ' from ' + str(table) + '')
            else:
                self.query = ('select * from ' + str(table) + '')

            if where:
                self.query = self.query + ' WHERE ' + where + ''
            print("Query selection com success!")
        except Exception as e:
            return e

    def submit_query(self):
        sql = self.getCursor()
        try:
            print(self.query)
            sql.execute(self.query)
            data = list(sql.fetchall())
            sql.close()
            if len(data) == 0:
                return self.functionAux.interface_bd('')
            return self.functionAux.interface_bd(data)
        except Error as e:
            return e
