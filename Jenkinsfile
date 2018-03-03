pipeline {
    agent { 
    	dockerfile {
        dir 'python'
    	}
    }
    stages {
        stage('build') {
            steps {
                sh '/app/python pytest'
            }
        }
    }
}