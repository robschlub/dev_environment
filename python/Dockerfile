FROM python:3.6.4-slim

WORKDIR /app

# This is the folder that will be shared with the docker host machine
RUN mkdir shared

ADD . .

RUN pip install -r requirements.txt

CMD ["bash"]