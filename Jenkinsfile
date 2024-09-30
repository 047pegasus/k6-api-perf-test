pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps { 
               checkout scm
               bat 'git pull'
            }
        }
        stage('Build') {
            steps {
                echo 'Building Node.js application...'
                bat 'npm install'
            }
        }
        stage('Executable Builds') {
            steps {
                echo 'Running build for executables...'
                bat 'npx pkg app.js --targets node18-linux-x64,node18-win-x64,node18-macos-x64 --out-path ./dist'
            }
        }
        stage('Load Testing with K6') {
            parallel{
                stage('Server Running') {
                    steps {
                        echo 'Spinning up server...'
                        keepRunning(label: 'API-Testing-Script'){
                            bat 'node app.js'
                        }
                    }
                }
                stage('K6 testing') {
                    steps {
                        echo 'Running K6 load tests...'
                        bat 'k6 run k6-test.js'
                    }
                }
            }
        }
        stage('Deploy') {
            when {
                expression { currentBuild.result == 'SUCCESS' }
            }
            steps {
                echo 'Deploying application...'
                bat 'git checkout deploy'
                bat 'git pull'
                bat 'git add .'
                bat 'git commit -m "Deploying new version"'
                bat 'git push origin deploy'
            }
        }
    }
}
