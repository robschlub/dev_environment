MODE=prod

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

HOST_PATH=`pwd`

docker run -it --rm \
    -v $HOST_PATH/app:/opt/app/app \
    --name devbuild \
    --entrypoint "npm" \
    devbuild \
    -c run webpack -- --env.mode=$MODE


