pipeline {
    agent none
    stages {
        stage('JS Building') {
    		agent { 
                docker {
			         	image 'test-js'
                    }
			    }
            steps {
                  sh "cp -R shared/* /app/shared"
                  sh "cd /app && npm run webpack"

            }
        }
    }
}