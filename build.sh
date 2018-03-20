#!/usr/bin/env sh

# Use:
#   ./build.sh dev              Lint, test and build dev version of app
#   ./build.sh stage            Lint, test and build stage version of app
#   ./build.sh prod             Lint, test and build prod version of app
#   ./build.sh prod deploy      Lint, test, build and deploy

MODE=prod
HOST_PATH=`pwd`

# Setup colors and text formatting
red=`tput setaf 1`
green=`tput setaf 2`
cyan=`tput setaf 6`
bold=`tput bold`
reset=`tput sgr0`

if [[ -z "${BRANCH}" ]];
  then
  BRANCH=`git rev-parse --abbrev-ref HEAD`
fi
echo $BRANCH
exit 0

# Check first command line argument to see how to build javascript
if [ $1 = "dev" ];
then
  MODE=dev
fi

if [ $1 = "stage" ];
then
  MODE=stage
fi

# Run a container while binding the appropriate volumes
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
    echo "${bold}${cyan}" $1 "${bold}${red}Failed${reset}"
    echo
    FAIL=1
    else
    echo "${bold}${cyan}" $1 "${bold}${green}Succeeded${reset}"
    echo
  fi
}

# Check current build status and exit if in failure state
check_status() {
  if [ $FAIL != 0 ];
    then
    echo "${bold}${red}Build failed at${bold}${cyan}" $1 "${reset}"
    exit 1    
  fi
}


# Build docker image
echo "${bold}${cyan}================= Building Image ===================${reset}"
cp containers/Dockerfile_dev Dockerfile
docker build -t devbuild .
rm Dockerfile

FAIL=0

# Lint and type check
echo "${bold}${cyan}============ Linting and Type Checking =============${reset}"
docker_run "JS Linting" npm run lint
docker_run "Flow" npm run flow
docker_run "Python Linting" flake8
check_status "Linting and Type Checking"

# Test
echo "${bold}${cyan}===================== Testing ======================${reset}"
docker_run "JS Testing" npm run jest
docker_run "Python Testing" pytest
check_status "Tests"

# Package
echo "${bold}${cyan}==================== Packaging =====================${reset}"
docker_run "Packaging" npm run webpack -- --env.mode=prod
check_status "Building"

# Deploy to:
#   Production if branch is master
#   Dev if branch is release-candidate


if [ $2 ];
  then
  if [ $2 = "deploy" ];
    then
    APP_NAME=''
    TITLE_STRING=''
    if [ $BRANCH = "travis" ];
      then
      APP_NAME=$HEROKU_APP_NAME
      TITLE_STRING='============= Deploying to Production =============='
      echo "App Name:" $APP_NAME
      echo "Heroku App Name:" $HEROKU_APP_NAME
    fi
    if [ $BRANCH = "release-candidate" ];
      then
      APP_NAME=$HEROKU_DEV_APP_NAME
      TITLE_STRING='================= Deploying to Dev ================='
    fi

    if [ $APP_NAME ];
      then
      echo "${bold}${cyan}" TITLE_STRING "${reset}"
      docker login --username=_ --password=$HEROKU_TOKEN registry.heroku.com

      cp containers/Dockerfile_prod ./Dockerfile
      
      docker build -t registry.heroku.com/$APP_NAME/web .
      docker push registry.heroku.com/$APP_NAME/web
    fi
  fi
fi