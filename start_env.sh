DOCKERFILE='Dockerfile_prod'
HOST_PORT=5000
CMD=''

stop_dev_server() {
  SERVER_RUNNING=`docker ps --format {{.Names}} \
                | grep devenv-dev-server`
  if [ $SERVER_RUNNING ];
    then
    echo Dev server container is running - stopping...
    docker stop devenv-dev-server
  fi
}

if [ $1 ];
then
  DOCKERFILE=Dockerfile_$1
fi

if [ $1 = "prod" ];
then
  HOST_PORT=5000
  CONTAINTER_PORT=4000
  stop_dev_server
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

if [ $1 = 'dev-server' ];
  then
  HOST_PORT=5003
  CONTAINTER_PORT=5000
  DOCKERFILE="Dockerfile_dev"
  CMD=/opt/app/dev-server.sh
fi

cp containers/$DOCKERFILE Dockerfile

GUNICORN_PORT=4000
docker build -t devenv-$1 .

rm Dockerfile

if [ $1 = 'prod' ];
  then
  docker run -it --rm \
    --name devenv-$1 \
    -p $HOST_PORT:$CONTAINTER_PORT \
    --env PORT=$CONTAINTER_PORT \
    devenv-$1
else
  docker run -it --rm \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/tests:/opt/app/tests \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/app:/opt/app/app \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/src:/opt/app/src \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/containers/dev/webpack.config.js:/opt/app/webpack.config.js \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/containers/dev/lessons.js:/opt/app/lessons.js \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/containers/dev/update_paths.py:/opt/app/update_paths.py \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/.eslintrc.json:/opt/app/.eslintrc.json \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/.flake8:/opt/app/.flake8 \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/jest.config.js:/opt/app/jest.config.js \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/.stylelintrc:/opt/app/.stylelintrc \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/containers/dev/pytest.ini:/opt/app/pytest.ini \
    --name devenv-$1 \
    -p $HOST_PORT:$CONTAINTER_PORT \
    devenv-$1 $CMD
fi