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
                sh "flow"
                sh "eslint shared"
            }
        }
        stage('JS Tests') {
            agent { 
                    dockerfile {
                        filename "Dockerfile_js"
                    }
                }
            steps {
                sh "jest"
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
                sh "cd /app && npm run webpack"
            }
        }
    }
}