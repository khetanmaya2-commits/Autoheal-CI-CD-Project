pipeline{
    agent any

    stages{
        stage('Checkout'){
            steps{
                git branch: 'main',
                    url: 'https://github.com/khetanmaya2-commits/Autoheal-CI-CD-Project.git'
            }
        }
        stage('Install dependencies'){
            steps{
                bat 'npm ci'
            }
        }
        stage('Test'){
            steps{
                bat 'npm test'
            }
        }
        stage('Verify docker'){
            steps{
                bat 'where docker'
                bat 'docker version'
            }
        }
        stage('Build Docker Image'){
            steps{
                bat 'docker build -t autoheal:app:%BUILD_NUMBER% .'
            }
        }
      
    }
    post{
        success{
            echo 'Autoheal CI pipeline completed successfully!'
        }
        failure{
            echo 'AutoHeal CI pipeline failed, Check the console output'
        }
    }
}