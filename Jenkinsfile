pipeline {
    agent any

    stages {
        stage('Installing Dependencies') {
            steps {
                // Send a Datadog event for the start of this stage
                datadogSendEvent(
                    title: "Jenkins Stage Event",
                    message: "Starting Installing Dependencies stage",
                    alertType: "info"
                )
                echo 'Checking out and version checking...'
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                // Send a Datadog event for the start of the Build stage
                datadogSendEvent(
                    title: "Jenkins Stage Event",
                    message: "Starting Build stage. Running build ${env.BUILD_ID} on ${env.JENKINS_URL}",
                    alertType: "info"
                )
                echo 'Building...'
                echo "Running ${env.BUILD_ID} on ${env.JENKINS_URL}"
            }
        }
        stage('Test') {
            steps {
                // Send a Datadog event for the start of the Test stage
                datadogSendEvent(
                    title: "Jenkins Stage Event",
                    message: "Starting Test stage",
                    alertType: "info"
                )
                echo 'Testing...'
            }
        }
        stage('Deploy') {
            steps {
                // Send a Datadog event for the start of the Deploy stage
                datadogSendEvent(
                    title: "Jenkins Stage Event",
                    message: "Starting Deploy stage",
                    alertType: "info"
                )
                echo 'Deploying...'
            }
        }
    }
}
