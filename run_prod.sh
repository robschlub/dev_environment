docker build -t test-prod .

docker run -it --rm -v /Users/rob/Dropbox/Programming/Repositories/Test_Projects/dev_environment/app:/app/app --name dev-prod -p 5001:5000 test-prod


