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
                sh "npm list uglifyjs-webpack-plugin"
                sh "ls /app/node_modules/uglifyjs-webpack-plugin"
                sh "npm run webpack"
            }
        }
    }
}