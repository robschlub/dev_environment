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
                sh "flow"
            }
        }
        stage('JS Building') {
        		agent { 
				    	dockerfile {
				        filename "Dockerfile_js"
				    	}
				    }
            steps {
                sh "npm ls --depth=0"
                sh "npm run webpack"
            }
        }
    }
}