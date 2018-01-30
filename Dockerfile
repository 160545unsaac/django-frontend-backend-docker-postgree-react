FROM python:3.6.2

ENV PYTHONUNBUFFERED 1

RUN mkdir /code
WORKDIR /code

COPY . /code/
RUN pip install -r src/my_project/requirements.txt
