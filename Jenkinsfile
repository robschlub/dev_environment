pipeline {
    agent none
    stages {
        stage('Python Lint and Test') {
            agent { 
                    dockerfile {
                        filename "Dockerfile_python"
                    }
                }
            steps {
                sh "flake8"
                sh "pytest"
            }
        }
        stage('JS Lint and Test') {
            agent { 
                    dockerfile {
                        filename "Dockerfile_js"
                    }
                }
            steps {
                sh "cp -R shared/* /app/shared"     
                sh "cd /app flow"
                sh "cd /app eslint shared"   
                sh "cd /app && npm run jest"
            }
        }
        stage('JS Building') {
            agent { 
                    dockerfile {
                        filename "Dockerfile_js"
                    }
                }
            steps {
                sh "cp -R shared/* /app/shared"     // This is needed as jenkins runs in the workspace path and not the container path
                sh "cd /app && npm run webpack-prod"
                sh "cd /app && npm run webpack-stage"
            }
        }
    }
}