pipeline {
    agent none
    stages {
    		agent { 
		    	dockerfile {
		        dir 'python'
		    	}
		    }
        stage('build') {
            steps {
                sh flake8
            }
        }
    }
}