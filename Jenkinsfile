pipeline {
    agent any

    stages {
        stage('1. Checkout') {
            steps { checkout scm }
        }

        stage('2. Build test image') {
            steps {
                // Use the "builder" stage: it also includes the devDependencies (vitest)
                sh 'docker build --target builder -t backend-test:${BUILD_NUMBER} .'
            }
        }

        stage('3. Test e coverage') {
            steps {
                sh '''
                    docker run --name cov-${BUILD_NUMBER} backend-test:${BUILD_NUMBER} pnpm test:cov
                    status=$?
                    docker cp cov-${BUILD_NUMBER}:/usr/src/app/coverage ./coverage || true
                    docker rm cov-${BUILD_NUMBER}
                    exit $status
                '''
            }
        }

        stage('4. SonarQube') {
            steps {
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        docker run --rm \
                          --network ci-net \
                          --volumes-from jenkins-local \
                          -w "$WORKSPACE" \
                          sonarsource/sonar-scanner-cli \
                          -Dsonar.host.url=http://sonarqube:9000 \
                          -Dsonar.token=$SONAR_TOKEN
                    '''
                }
            }
        }

        stage('5. Build final image') {
            steps {
                sh 'docker build --target runner -t nodejs-backend:${BUILD_NUMBER} .'
            }
        }
    }

    post {
        success { echo "Pipeline completed successfully!" }
        failure { echo "The pipeline has failed." }
    }
}