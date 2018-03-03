pipeline {
	agent { 
    	dockerfile {
        dir 'python'
    	}
    }
    stages {
        stage('build python') {
        		
            steps {
                sh 'flake8'
                sh 'pytest'
            }
        }
        stage('build js') {
      #  		agent { 
		#		    	dockerfile {
		#		        dir 'node'
		#		    	}
		#		    }
            steps {
                sh 'eslint shared'
            }
        }
    }
}