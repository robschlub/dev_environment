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
                PATH = "/app/node_modules/.bin:/app/node_modules:${PATH}"
              }
            steps {
                sh "flow"
                // sh "ls /app/node_modules"
                sh "echo $PATH"
                sh "pwd"
                sh "ls -la"
                sh "ls -la app"
                // sh "ls /app/node_modules/uglifyjs-webpack-plugin"
                sh "whoami"
                sh "npm list"
                sh "npm -g list"
                sh "npm run webpack"
            }
        }
    }
}