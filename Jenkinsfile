pipeline {
    agent { 
    	dockerfile {
        dir 'python'
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