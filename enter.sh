DOCKERFILE='Dockerfile_prod'
HOST_PORT=5000
if [ $1 ];
then
  DOCKERFILE=Dockerfile_$1
fi

if [ $1 = "prod" ];
then
  HOST_PORT=5000
  CONTAINTER_PORT=4000
fi

if [ $1 = "stage" ];
then
  HOST_PORT=5001
  CONTAINTER_PORT=5000
fi

if [ $1 = "dev" ];
then
  HOST_PORT=5002
  CONTAINTER_PORT=5000
fi

cp setup/$DOCKERFILE Dockerfile

GUNICORN_PORT=4000
docker build -t test-$1 .

rm Dockerfile

if [ $1 = 'prod' ];
then
  docker run -it --rm \
    --name dev-$1 \
    -p $HOST_PORT:$CONTAINTER_PORT \
    --env PORT=$CONTAINTER_PORT \
    test-$1
else
  docker run -it --rm \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/shared:/app/shared \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/setup/webpack.config.js:/app/webpack.config.js \
    --name dev-$1 \
    -p $HOST_PORT:$CONTAINTER_PORT \
    test-$1
fi

