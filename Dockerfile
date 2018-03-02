FROM python:3.6.4-slim

WORKDIR /app

ADD requirements.txt .

ADD Dockerfile .

ADD app .

RUN pip install -r requirements.txt

EXPOSE 5000

ENV FLASK_APP app/app.py

CMD ["bash"]

# CMD ["flask", "run", "--host=0.0.0.0"]
