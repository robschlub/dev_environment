DOCKERFILE='Dockerfile_prod'
if [ $1 ]
then
  DOCKERFILE=Dockerfile_$1
fi

# echo $DOCKERFILE
cp $DOCKERFILE Dockerfile

docker build -t test-$1 .


docker run -it --rm -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/shared:/app/shared --name dev-$1 test-$1

