
pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'ap-south-1'
        EB_APPLICATION = 'AutoHeal'
        EB_ENVIRONMENT = 'AutoHeal-env'
        S3_BUCKET = 'autoheal-deploy-artifacts-2026-maya'
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        AWS_CLI = 'C:\\Program Files\\Amazon\\AWSCLIV2\\aws.exe'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/khetanmaya2-commits/Autoheal-CI-CD-Project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t autoheal-app:%BUILD_NUMBER% .'
            }
        }

        stage('Package Deployment') {
            steps {
                bat '''
                    if exist autoheal-deploy.zip del autoheal-deploy.zip
                    powershell -NoProfile -Command "Compress-Archive -Path server.js,package.json,package-lock.json,Dockerfile -DestinationPath autoheal-deploy.zip -Force"
                '''
            }
        }

        stage('Upload to S3') {
            steps {
                bat '''
                    "%AWS_CLI%" s3 cp autoheal-deploy.zip s3://%S3_BUCKET%/releases/autoheal-%BUILD_NUMBER%.zip --region %AWS_DEFAULT_REGION%
                '''
            }
        }

        stage('Create Application Version') {
            steps {
                bat '''
                    "%AWS_CLI%" elasticbeanstalk create-application-version ^
                      --application-name "%EB_APPLICATION%" ^
                      --version-label "autoheal-%BUILD_NUMBER%" ^
                      --source-bundle S3Bucket="%S3_BUCKET%",S3Key="releases/autoheal-%BUILD_NUMBER%.zip" ^
                      --region %AWS_DEFAULT_REGION%
                '''
            }
        }

        stage('Deploy to Elastic Beanstalk') {
            steps {
                bat '''
                    "%AWS_CLI%" elasticbeanstalk update-environment ^
                      --environment-name "%EB_ENVIRONMENT%" ^
                      --version-label "autoheal-%BUILD_NUMBER%" ^
                      --region %AWS_DEFAULT_REGION%
                '''
            }
        }

        stage('Wait for Deployment') {
            steps {
                bat '''
                    "%AWS_CLI%" elasticbeanstalk wait environment-updated ^
                      --environment-names "%EB_ENVIRONMENT%" ^
                      --region %AWS_DEFAULT_REGION%
                '''
            }
        }

        stage('Health Check') {
            steps {
                bat '''
                    powershell -NoProfile -Command "$envUrl = & '%AWS_CLI%' elasticbeanstalk describe-environments --environment-names '%EB_ENVIRONMENT%' --region '%AWS_DEFAULT_REGION%' --query 'Environments[0].CNAME' --output text; if (-not $envUrl -or $envUrl -eq 'None') { throw 'Environment URL not found' }; $url = 'http://' + $envUrl + '/health'; Write-Host ('Checking ' + $url); $response = Invoke-RestMethod -Uri $url -TimeoutSec 30; if ($response.status -ne 'healthy') { throw 'Health check failed' }; Write-Host 'AutoHeal health check passed'"
                '''
            }
        }
    }

    post {
        success {
            echo 'AutoHeal CI/CD deployment completed successfully!'
        }
        failure {
            echo 'AutoHeal pipeline failed. Check the console output.'
        }
    }
}
