import json


class FunctionUtils:
    def __init__(self):
        self = self

    def message_return(self, response=None, message='', status=0, error=''):
        if ((response or error) and status):
            return {
                "message": message,
                "response": response,
                "status": status,
                "error": error
            }

    def interface_data(self, typeRequest='', flag='', data=()):
        if(flag and typeRequest):
            return {
                "type": typeRequest,
                "flag": flag,
                'data': data if data else {},
            }

    def interface_bd(self, data=None):
        if data:
            return {
                "status": 200,
                "data": data
            }
        return {
            "status": 404,
            "data": []
        }

