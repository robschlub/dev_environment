pipeline {
    agent none
    stages {
        stage('JS Building') {
    		agent { 
                docker {
			         	image 'test-js'
                        args '-v ${WORKSPACE}/shared:/app/shared'
                    }
			    }
            //environment {
            //    PATH = "/app/node_modules/.bin:/app/node_modules:${PATH}"
            //  }
            steps {
//                dir('/app') {
//                // sh "flow"
//                // sh "ls /app/node_modules"
//                // sh "echo $PATH"
//                  sh "cd /app && pwd"
//                sh "ls -la"
//                sh "ls -la app"
//                // sh "ls /app/node_modules/uglifyjs-webpack-plugin"
//                sh "whoami"
//                sh "which flow"
//                sh "ls -la /app"
//                sh "npm list"
//                sh "npm -g list"
                  sh "echo ${WORKSPACE}"
                  sh "echo ${HOME}"
                  sh "cp -R shared/* /app/shared"
                  sh "cd /app && ls"
                  sh "cd /app && ls shared"
                  sh "cd /app && ls shared/app"
                  sh "cd /app && ls shared/app/app"
                  sh "cd /app && ls shared/app/app/static"
                  sh "cd /app && ls shared/app/app/static/src"
                  sh "cd /app && npm run webpack"
//                }
            }
        }
    }
}