DOCKERFILE='Dockerfile_prod'
PORT=5000
if [ $1 ]
then
  DOCKERFILE=Dockerfile_$1
fi

if [ $1 = "prod" ]
then
  PORT=5001
fi

if [ $1 = "python" ]
then
  PORT=5002
fi

if [ $1 = "js" ]
then
  PORT=5003
fi
# echo $DOCKERFILE $PORT
cp $DOCKERFILE Dockerfile

docker build -t test-$1 .

docker run -it --rm \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/shared:/app/shared \
    -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/webpack.config.js:/app/webpack.config.js \
    --name dev-$1 \
    -p $PORT:5000 \
    test-$1

