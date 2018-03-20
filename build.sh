#!/usr/bin/env sh
MODE=prod
HOST_PATH=`pwd`

red=`tput setaf 1`
green=`tput setaf 2`
cyan=`tput setaf 6`
bold=`tput bold`
reset=`tput sgr0`

if [ $1 = "dev" ];
then
  MODE=dev
fi

if [ $1 = "stage" ];
then
  MODE=stage
fi

docker_run() {
  echo "${bold}${cyan}" $1 "Starting${reset}"
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
    echo "${bold}${cyan}" $1 "${red}Failed${reset}"
    echo
    FAIL=1
    else
    echo "${bold}${cyan}" $1 "${green}Succeeded${reset}"
    echo
  fi
}

check_status() {
  if [ $FAIL != 0 ];
    then
    echo "${bold}${red}Build failed at${cyan}" $1 "${reset}"
    exit 1    
  fi
}



# Lint and type checking
echo "${bold}${cyan}================= Building Image ===================${reset}"
cp containers/Dockerfile_dev Dockerfile
docker build -t devbuild .
rm Dockerfile

FAIL=0

# Lint and type checking
echo "${bold}${cyan}============ Linting and Type Checking =============${reset}"
docker_run "JS Linting" npm run lint
docker_run "Flow" npm run flow
docker_run "Python Linting" flake8
check_status "Linting and Type Checking"

# Testing
echo "${bold}${cyan}===================== Testing ======================${reset}"
docker_run "JS Testing" npm run jest
docker_run "Python Testing" pytest
check_status "Tests"

# Packaging
echo "${bold}${cyan}==================== Packaging =====================${reset}"
docker_run "Packaging" npm run webpack -- --env.mode=prod
check_status "Building"

# Deploy
if [ $2 ];
  then
  if [ $2 = "deploy" ];
    then
    echo "${bold}${cyan}===================== Deploying ======================${reset}"
    cp containers/Dockerfile_prod ./Dockerfile
    docker login --username=_ --password=$HEROKU_TOKEN registry.heroku.com
    docker build -t registry.heroku.com/$HEROKU_APP_NAME/web .
    docker push registry.heroku.com/$HEROKU_APP_NAME/web
  fi
fi