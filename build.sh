#!/usr/bin/env sh
MODE=prod
HOST_PATH=`pwd`

docker_run() {
  echo $1 "Starting"
  if [ $3 ];
    then
    docker run -it --rm \
      -v $HOST_PATH/app:/opt/app/app \
      -v $HOST_PATH/tests:/opt/app/tests \
      --name devbuild \
      --entrypoint $2 \
      devbuild \
      -c $3 $4 $5 $6
    else
    docker run -it --rm \
      -v $HOST_PATH/app:/opt/app/app \
      -v $HOST_PATH/tests:/opt/app/tests \
      --name devbuild \
      --entrypoint $2 \
      devbuild
  fi

  if [ $? != 0 ];
    then
    echo $1 "Failed"
    FAIL=1
    else
    echo $1 "Succeeded"
  fi
}

check_status() {
  if [ $FAIL != 0 ];
    then
    echo "Failed" $1
    exit 1    
  fi
}

if [ $1 = "dev" ];
then
  MODE=dev
fi

if [ $1 = "stage" ];
then
  MODE=stage
fi

cp containers/Dockerfile_dev Dockerfile
docker build -t devbuild .
rm Dockerfile

FAIL=0

# Lint and type checking
echo "============ Linting and Type Checking ============="
docker_run "JS Linting" npm run lint
docker_run "Flow" npm run flow
docker_run "Python Linting" flake8
check_status "Linting and Type Checking"

# Testing
echo "===================== Testing ======================"
docker_run "JS Testing" npm run jest
docker_run "Python Testing" pytest
check_status "Tests"

# Packaging
echo "==================== Packaging ====================="
docker_run "Packaging" npm run webpack -- --env.mode=prod
check_status "Building"

# Deploy
if [ $2 ];
  then
  if [ $2 = "deploy" ];
    then
    echo "===================== Deploying ======================"
    cp containers/Dockerfile_prod ./Dockerfile
    docker login --username=_ --password=$HEROKU_TOKEN registry.heroku.com
    docker build -t registry.heroku.com/$HEROKU_APP_NAME/web .
    docker push registry.heroku.com/$HEROKU_APP_NAME/web
  fi
fi