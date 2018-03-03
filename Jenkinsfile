pipeline {
    agent { 
    	docker {
    		image 'test-python' 
    		}
    	}
    stages {
        stage('build') {
            steps {
                sh 'python flake8'
            }
        }
    }
}