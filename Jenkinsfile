pipeline {
    stages {
        stage('build python') {
        		agent { 
				    	dockerfile {
				        dir 'python'
				    	}
				    }
            steps {
                sh 'flake8'
                sh 'pytest'
            }
        }
        stage('build js') {
        		agent { 
				    	dockerfile {
				        dir 'node'
				    	}
				    }
            steps {
                sh 'eslint shared'
            }
        }
    }
}