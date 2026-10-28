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