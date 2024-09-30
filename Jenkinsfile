pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps { 
               checkout scm
               bat 'git pull origin master'
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
        stage('Start Server & Run K6 Load Test') {
            parallel {
                stage('Start Server') {
                    steps {
                        echo 'Starting the Node.js server...'
                        // Start the Node.js server in the background
                        bat 'start /B node app.js &'
                    }
                }
                stage('Run K6 Load Test') {
                    steps {
                        echo 'Running K6 performance test...'
                        // Ensure K6 is installed in your environment
                        bat 'k6 run k6-test.js'
                    }
                }
            }
        }
        stage('Stop Server') {
            steps {
                echo 'Stopping the server...'
                // Kill the server process running on default port 3000
                bat "taskkill /f /im node.exe || exit 0"
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
    post {
        always {
            echo 'Cleaning up...'
            // Make sure the server is stopped in case of any failures
            bat "taskkill /f /im node.exe"
        }
    }
}
