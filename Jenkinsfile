pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'emmanuelv3g4/blog-nutriologia'  // Cambia esto
        DOCKER_TAG = "${env.BUILD_ID}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/EmmanuelVegaLira/pague-nutriologia'  // URL pública de tu repo
            }
        }

    

        stage('Test') {
            steps {
                // Aquí puedes agregar pruebas si las tienes
                echo "Ejecutando pruebas (simuladas para el laboratorio)"
                // sh 'npm test' o el comando que uses para tests
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Detener y eliminar el contenedor actual si existe
                    sh 'docker stop blog-nutriologia || true'
                    sh 'docker rm blog-nutriologia || true'
                    
                    // Ejecutar el nuevo contenedor
                    sh """
                    docker run -d \
                    --name blog-nutriologia \
                    -p 8080:8080 \
                    ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline completado - limpiando'
            // Limpiar imágenes antiguas si lo deseas
            sh 'docker system prune -f || true'
        }
        success {
            echo '¡Despliegue exitoso! La aplicación está actualizada.'
        }
        failure {
            echo 'Pipeline falló - revisar logs'
        }
    }
}
