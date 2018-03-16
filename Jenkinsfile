pipeline {
    agent none
    stages {
//        stage('Python Lint and Test') {
//            agent { 
//                    dockerfile {
//                        filename "Dockerfile_python"
//                    }
//                }
//            steps {
//                sh "flake8"
//                sh "pytest"
//           }
//        }
//        stage('JS Lint and Test') {
//            agent { 
//                    dockerfile {
//                        filename "Dockerfile_js"
//                    }
//                }
//            steps {
//                sh "cp -R shared/* /app/shared"     
//                sh "cd /app flow"
//                sh "cd /app eslint shared"   
//                sh "cd /app && npm run jest"
//            }
//        }
        stage('JS Building') {
            agent { 
                    dockerfile {
                        filename "Dockerfile_js"
                    }
                }
            steps {
                script {
                    if (env.BRANCH_NAME == "heroku-integration-test") {
                        // sh "ls -la shared/app/app/static/dist"
                        sh "ls -la"
                        sh "pwd"
                        sh "ls -la shared/app/app/static/src"
                        sh "ls /app"

                        sh "cp -R shared/* /app/shared"     // This is needed as jenkins runs in the workspace path and not the container path

                        sh "ls /app/shared"
                        
                        sh "cd /app && npm run webpack -- --env.mode=prod"
                        
                        // sh "rm -rf shared/app/app/static/dist"
                        
                        sh "mkdir shared/app/app/static/dist"
                        
                        sh "cp -R /app/shared/app/app/static/dist shared/app/app/static/dist"
                        
                        sh "git status"
                        
                        sh "ls -la shared/app/app/static/dist"
                        }
                    else {
                        sh "cp -R shared/* /app/shared"     // This is needed as jenkins runs in the workspace path and not the container path
                        sh "cd /app && npm run webpack -- --env.mode=stage"
                    }
                }
            }
        }
    }
}