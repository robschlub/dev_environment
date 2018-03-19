MODE=prod

if [ $1 = "dev" ];
then
  MODE=dev
fi

if [ $1 = "stage" ];
then
  MODE=stage
fi

cp setup/Dockerfile_dev Dockerfile

docker build -t build-temp .

rm Dockerfile

docker run -it --rm \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/app:/opt/app/app \
    --name build-temp \
    --entrypoint "npm" \
    build-temp \
    -c run webpack -- --env.mode=$MODE


