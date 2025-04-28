pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        IMAGE_NAME = 'tuusuario/nutriologa-alexia'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/tuusuario/nutriologa-alexia.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${env.BUILD_NUMBER}")
                }
            }
        }

        stage('Test') {
            steps {
                sh 'docker run --rm ${IMAGE_NAME}:${env.BUILD_NUMBER} nginx -t'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-creds') {
                        docker.image("${IMAGE_NAME}:${env.BUILD_NUMBER}").push()
                        docker.image("${IMAGE_NAME}:latest").push()
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_PRODUCTION_IP} \
                        "docker pull ${IMAGE_NAME}:${env.BUILD_NUMBER} && \
                        docker stop nutriologa-app || true && \
                        docker rm nutriologa-app || true && \
                        docker run -d -p 80:80 --name nutriologa-app ${IMAGE_NAME}:${env.BUILD_NUMBER}"
                    """
                }
            }
        }
    }

    post {
        success {
            slackSend color: 'good', message: "Build ${env.BUILD_NUMBER} desplegada exitosamente!"
        }
        failure {
            slackSend color: 'danger', message: "Build ${env.BUILD_NUMBER} falló!"
        }
    }
}