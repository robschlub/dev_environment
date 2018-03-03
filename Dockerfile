FROM python:3.6.4-slim

WORKDIR /app

# This is the folder that will be shared with the docker host machine
RUN mkdir shared

ADD requirements.txt .
ADD .flake8 .

RUN pip install -r requirements.txt

ENV FLASK_APP shared/app/app.py

CMD ["bash"]

# CMD ["flask", "run", "--host=0.0.0.0"]
