pipeline {
    agent none
    stages {
        stage('build') {
        		agent { 
				    	dockerfile {
				        dir 'python'
				    	}
				    }
            steps {
                sh "flake8"
            }
        }
    }
}