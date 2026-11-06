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