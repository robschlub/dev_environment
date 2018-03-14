pipeline {
    agent none
    stages {
        stage('JS Building') {
    		agent { 
			    	dockerfile {
			        filename "Dockerfile_js"
			    	}
			    }
            environment {
                PATH = "/app/node_modules/.bin:$PATH"
              }
            steps {
                sh "flow"
                sh "ls /app/node_modules"
                sh "echo $PATH"
                sh "pwd"
                sh "ls"
                sh "ls /app/node_modules/uglifyjs-webpack-plugin"
                sh "npm list"
                sh "npm -g list"
                sh "npm run webpack"
            }
        }
    }
}