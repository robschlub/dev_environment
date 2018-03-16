DOCKERFILE='Dockerfile_prod'
PORT=5000
if [ $1 ];
then
  DOCKERFILE=Dockerfile_$1
fi

if [ $1 = "prod" ];
then
  PORT=5000
fi

if [ $1 = "flask" ];
then
  PORT=5001
fi

if [ $1 = "python" ];
then
  PORT=5002
fi

if [ $1 = "js" ];
then
  PORT=5003
fi

if [ $1 = "heroku" ];
then
  PORT=5001
fi

cp $DOCKERFILE Dockerfile

GUNICORN_PORT=4000
docker build --build-arg P1=4000 -t test-$1 .

rm Dockerfile

if [ $1 = 'heroku' ];
then
  docker run -it --rm \
    --name dev-$1 \
    -p $PORT:4000 \
    --env P1:4000 \
    test-$1
else
  docker run -it --rm \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/shared:/app/shared \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/webpack.config.js:/app/webpack.config.js \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/.eslintrc.json:/app/.eslintrc.json \
    --name dev-$1 \
    -p $PORT:5000 \
    test-$1
fi

