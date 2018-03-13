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
                sh "eslint shared"
            }
        }
        stage('JS Building') {
        		agent { 
				    	dockerfile {
				        filename "Dockerfile_js"
				    	}
				    }
            steps {
                sh "npm run webpack"
            }
        }
    }
}