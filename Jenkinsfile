pipeline {
    agent none
    stages {
        stage('JS Building') {
            
    		agent { 
                docker {
			         	image 'test-js'
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
                  sh "cd /app && pwd"
//                sh "ls -la"
//                sh "ls -la app"
//                // sh "ls /app/node_modules/uglifyjs-webpack-plugin"
//                sh "whoami"
//                sh "which flow"
//                sh "ls -la /app"
//                sh "npm list"
//                sh "npm -g list"
//                sh "npm run webpack"
//                }
//            }
        }
    }
}