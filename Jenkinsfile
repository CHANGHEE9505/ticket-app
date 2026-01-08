pipeline {
    agent any
    
    environment {
        // 본인의 도커 허브 아이디로 변경 필수!
        DOCKER_REGISTRY = "clouddxuser" 
        
        // 아까 젠킨스에 등록한 ID 이름
        DOCKER_CRED = "dockerhub-login"
    }

    stages {
        stage('Checkout') {
            steps {
                // 깃허브에서 코드를 가져옵니다
                git branch: 'main', url: 'https://github.com/CHANGHEE9505/ticket-app.git'
            }
        }
        
        stage('Build & Push Backend') {
            steps {
                script {
                    // 백엔드 이미지 만들기 (태그는 빌드 번호 사용 v1, v2...)
                    sh "docker build -t ${DOCKER_REGISTRY}/ticket-backend:v${BUILD_NUMBER} ./backend"
                    
                    // 도커 허브 로그인 & 푸시
                    withCredentials([usernamePassword(credentialsId: DOCKER_CRED, passwordVariable: 'DOCKER_PW', usernameVariable: 'DOCKER_USER')]) {
                        sh "echo $DOCKER_PW | docker login -u $DOCKER_USER --password-stdin"
                        sh "docker push ${DOCKER_REGISTRY}/ticket-backend:v${BUILD_NUMBER}"
                    }
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                script {
                    // 프론트엔드 이미지 만들기
                    sh "docker build -t ${DOCKER_REGISTRY}/ticket-frontend:v${BUILD_NUMBER} ./frontend"
                    
                    // 푸시 (로그인은 위에서 했으므로 생략 가능하지만 안전하게 유지)
                    sh "docker push ${DOCKER_REGISTRY}/ticket-frontend:v${BUILD_NUMBER}"
                }
            }
        }
    }
}