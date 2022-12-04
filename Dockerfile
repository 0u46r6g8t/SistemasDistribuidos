# This build when running in development mode

FROM python:3.8 as Base

FROM Base as dev

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY . .

CMD [ "python3", "main.py"]