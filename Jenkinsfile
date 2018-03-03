pipeline {
    agent none
    stages {
        stage('Python Lint Check') {
        		agent { 
				    	dockerfile {
				        dir 'python'
				    	}
				    }
            steps {
                sh "flake8"
            }
        }
        stage('Python Tests') {
        		agent { 
				    	dockerfile {
				        dir 'python'
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
				        dir 'node'
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