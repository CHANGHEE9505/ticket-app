const orderBtn = document.getElementById('order-btn');
const loadingBtn = document.getElementById('loading-btn');
const messageBox = document.getElementById('message-box');
const seatCountSpan = document.getElementById('seat-count'); // HTML에 이거 추가해야 함

// 👇 (중요) 본인의 로드밸런서 주소로 변경!!
const API_URL = 'http://acdf45111be5a4516892841ac44e61a4-380652517.ap-northeast-2.elb.amazonaws.com/order';  

// 1. 실시간 잔여 좌석 확인 (1초마다 실행)
async function updateSeatCount() {
    try {
        const response = await fetch(`${API_URL}/remaining`);
        if (response.ok) {
            const data = await response.json();
            // 화면에 숫자 업데이트 (HTML에 span 태그 필요)
            const countDisplay = document.querySelector('.card-title'); // 제목 아래나 적절한 곳에 표시
            if(data.remaining <= 0) {
                 // 매진 시 디자인 변경
                 orderBtn.disabled = true;
                 orderBtn.innerText = "⛔ 매진 (Sold Out)";
                 orderBtn.classList.remove('btn-primary');
                 orderBtn.classList.add('btn-secondary');
            }
        }
    } catch (error) {
        console.error("좌석 정보 로딩 실패", error);
    }
}

// 1초마다 실행
setInterval(updateSeatCount, 1000);


// 2. 예매 버튼 클릭 로직
orderBtn.addEventListener('click', async () => {
    orderBtn.classList.add('d-none');
    loadingBtn.classList.remove('d-none');
    messageBox.classList.add('d-none');

    try {
        const response = await fetch(`${API_URL}/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'user_' + Math.floor(Math.random() * 10000) })
        });

        const data = await response.json();

        messageBox.classList.remove('d-none');
        if (response.ok) {
            messageBox.innerHTML = `<div class="alert alert-success fw-bold">🎉 ${data.message}</div>`;
            updateSeatCount(); // 성공하자마자 즉시 갱신
        } else {
            messageBox.innerHTML = `<div class="alert alert-danger fw-bold">😭 ${data.message}</div>`;
        }

    } catch (error) {
        messageBox.classList.remove('d-none');
        messageBox.innerHTML = `<div class="alert alert-dark fw-bold">❌ 서버 연결 실패/시간 초과</div>`;
    } finally {
        loadingBtn.classList.add('d-none');
        orderBtn.classList.remove('d-none');
    }
});