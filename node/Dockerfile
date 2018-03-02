FROM node:9.7.0-slim

WORKDIR /app

ADD . .

# This is the folder that will be shared with the docker host machine
RUN mkdir shared

# Install eslint and dependencies
RUN npm init -y

RUN npm install eslint eslint-plugin-import eslint-config-airbnb-base


# Update path so eslint can be run from anywhere
ENV PATH="/app/node_modules/.bin:${PATH}"

CMD ["bash"]