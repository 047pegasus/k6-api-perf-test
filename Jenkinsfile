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
        stage('Setup InfluxDB') {
            steps {
                script {
                    echo 'Setting up InfluxDB...'
                    
                    // Step 1: Spin up InfluxDB v1 Docker container
                    bat 'docker run -d -p 8086:8086 --name influxdb influxdb:1.8'

                    // Step 2: Wait for InfluxDB to be ready (adjust sleep time if needed)
                    sleep(time: 5, unit: "SECONDS")

                    // Step 3: Create the 'k6results' database in InfluxDB
                    bat '''docker exec influxdb influx -execute "CREATE DATABASE k6results"'''
                }
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
                        bat 'k6 run --out influxdb=http://localhost:8086/k6results k6-test.js'
                    }
                }
            }
        }
        // stage('Stop Server') {
        //     steps {
        //         echo 'Stopping the server...'
        //         // Kill the server process running on default port 3000
        //         bat "taskkill /f /im node.exe"
        //     }
        // }
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                // Deploy the application to the deploy branch
                echo 'Deployment completed and pushed to the deploy branch.'
            }
        }
    }
    post {
        always {
            echo 'Cleaning up...'
            // Make sure the server is stopped in case of any failures
            // bat "taskkill /f /im node.exe || exit 0"
            bat 'docker stop influxdb'
            bat 'docker rm influxdb'
        }
    }
}
