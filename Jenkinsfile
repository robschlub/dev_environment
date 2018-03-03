pipeline {
    agent none
    stages {
        stage('Python Lint Check') {
        		agent { 
				    	dockerfile {
				        file Dockerfile_python
				    	}
				    }
            steps {
                sh "flake8"
            }
        }
        stage('Python Tests') {
        		agent { 
				    	dockerfile {
				        file Dockerfile_python
				    	}
				    }
            steps {
            		sh "ls -la"
            		sh "pwd"
                sh "pytest"
            }
        }
        stage('JS Linting') {
        		agent { 
				    	dockerfile {
				        file Dockerfile_js
				    	}
				    }
            steps {
            		sh "ls -la"
            		sh "pwd"
                sh "eslint shared"
            }
        }
    }
}