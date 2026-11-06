pipeline{
    agent any

    stages{
        stage('1. Checkout Code') {
        // Jenkins clones/downloads the updated code from your repository
        checkout scm
        }
        stage('2. Installing Dependencies'){
            // Enable Corepack and install packages using pnpm
            sh 'corepack enable && pnpm install --frozen-lockfile'
        }
        stage('3. Test Execution and Coverage'){
            // Runs tests using Vitest and generates the code coverage we saw earlier
            sh 'pnpm test:cov' 
        }
    }

    post {
        success{
            echo "The first three steps of the pipeline have been successfully completed."
        }
        failure{
            echo "Oops, something went wrong during one of the steps."
        }
    }
}