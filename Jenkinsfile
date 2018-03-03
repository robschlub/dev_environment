pipeline {
    agent { docker 'test-python' }
    stages {
        stage('build') {
            steps {
                sh 'python --version'
            }
        }
    }
}