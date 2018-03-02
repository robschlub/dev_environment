FROM python:3.6.4-slim

WORKDIR /app

# This is the folder that will be shared with the docker host machine
RUN mkdir shared

ADD . .

RUN pip install -r requirements.txt

EXPOSE 5000

ENV FLASK_APP shared/app.py

CMD ["flask", "run", "--host=0.0.0.0"]