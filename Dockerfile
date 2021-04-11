FROM node:14.16.0

# set working directory
WORKDIR /frontend

# add `/app/node_modules/.bin` to $PATH
#ENV PATH node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
#COPY package-lock.json ./
RUN npm install --silent
#RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY . .

# start app
CMD ["npm", "start"]



FROM python:3.8

ENV PYTHONUNBUFFERED 1

RUN mkdir /code
WORKDIR /code

COPY . /code/
RUN pip install -r backend/my_project/requirements.txt
