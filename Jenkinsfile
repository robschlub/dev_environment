pipeline {
    agent { 
    	dockerfile {
        dir 'python'
    	}
    }
    stages {
        stage('build') {
            steps {
                sh 'flake8'
                sh 'pytest'
            }
        }
    }
}