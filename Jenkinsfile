pipeline {
    agent any

    stages {
        stage('checkout'){
            steps {
                echo 'checkout and ver checking...'
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                echo 'Building..'
                echo "Running ${env.BUILD_ID} on ${env.JENKINS_URL}"
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
