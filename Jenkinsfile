pipeline {
    agent none
    stages {
        stage('JS Building') {
        		agent { 
				    	dockerfile {
				        filename "Dockerfile_js"
				    	}
				    }
            steps {
                sh "flow"
                sh "ls /app/node_modules"
                sh "ls /app/node_modules/uglifyjs-webpack-plugin"
                sh "npm list"
                sh "npm run webpack"
            }
        }
    }
}