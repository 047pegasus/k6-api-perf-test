pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                sh 'git checkout master'
            }
        }
        stage('Build') {
            steps {
                echo 'Building Node.js application...'
                sh 'npm install'
            }
        }
        stage('Executable Builds') {
            steps {
                echo 'Running build for executables...'
                sh 'npx pkg app.js --targets node18-linux-x64,node18-win-x64,node18-macos-x64 --out-path ./dist'
            }
        }
        stage('Load Testing with K6') {
            parallel{
                stage('Server Running') {
                    steps {
                        echo 'Spinning up server...'
                        keepRunning(label: 'API-Testing-Script'){
                            sh 'node app.js'
                        }
                    }
                }
                stage('K6 testing') {
                    steps {
                        echo 'Running K6 load tests...'
                        sh 'k6 run k6-test.js'
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
                sh 'git checkout deploy'
                sh 'git pull'
                sh 'git add .'
                sh 'git commit -m "Deploying new version"'
                sh 'git push origin deploy'
            }
        }
    }
}
