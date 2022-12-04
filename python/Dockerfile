# This build when running in development mode

FROM python:3.9

RUN pip install mysql-connector-python

WORKDIR /usr/app/src

COPY main.py ./

CMD [ "python3", "main.py" ]