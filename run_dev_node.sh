cd node
docker build -t test-node .
docker run -it --rm -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/shared:/app/shared --name dev-node test-node
# docker run -it --rm test-node