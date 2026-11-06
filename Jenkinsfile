pipeline{
    agent any

    stages{
        stage('1. Checkout Code') {
            steps{
                // Jenkins clones/downloads the updated code from your repository
                checkout scm
            }
        }
        stage('2. Installing Dependencies'){
            steps{
                // run pnpm install inside a temporary Node 22 container
                sh '''
                    docker run --rm \
                      -v "$(pwd)":/app \
                      -w /app \
                      node:22-alpine \
                      sh -c "corepack enable && pnpm install --frozen-lockfile"
                '''
            }
        }
        stage('3. Test Execution and Coverage'){
           steps{
                // run the tests inside the isolated Node container.
                sh '''
                    docker run --rm \
                      -v "$(pwd)":/app \
                      -w /app \
                      node:22-alpine \
                      sh -c "corepack enable && pnpm test:cov"
                '''
           }
        }
        stage('4. SonarQube Analysis') {
            steps {
                // Let's securely retrieve the previously saved token
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        docker run --rm \
                          --network host \
                          -v "$(pwd)":/usr/src \
                          sonarsource/sonar-scanner-cli \
                          -Dsonar.host.url=http://localhost:9000 \
                          -Dsonar.token=$SONAR_TOKEN
                    '''
                }
            }
        }
    }

    post {
        success{
            echo "Pipeline executed successfully!"
        }
        failure{
            echo "The pipeline has failed."
        }
    }
}