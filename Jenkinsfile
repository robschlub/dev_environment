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
                sh "npm run webpack"
            }
        }
    }
}