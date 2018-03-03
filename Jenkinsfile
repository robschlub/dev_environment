pipeline {
    agent none
    stages {
        stage('Python Lint Check') {
        		agent { 
				    	dockerfile {
				        filename "Dockerfile_python"
				    	}
				    }
            steps {
                sh "flake8"
            }
        }
        stage('Python Tests') {
        		agent { 
				    	dockerfile {
				        filename "Dockerfile_python"
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
				        filename "Dockerfile_js"
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