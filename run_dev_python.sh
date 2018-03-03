cd python
docker build -t test-python .
cd ..

docker run -it --rm -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/shared:/app/shared --name dev-python test-python


