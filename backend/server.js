const express = require('express');
const cors = require('cors');
const Redis = require('ioredis');
const app = express();

app.use(cors());
app.use(express.json());

// Redis 연결 (환경변수 또는 기본값)
const redisHost = process.env.REDIS_HOST || 'redis-service';
const redis = new Redis({
    host: redisHost,
    port: 6379,
    connectTimeout: 10000 
});

// 초기 티켓 수 설정 (서버 켜질 때 없으면 1000장으로 세팅)
redis.setnx('tickets', 1000); 

// 1. [조회 API] 현재 남은 티켓 수 확인 (프론트에서 1초마다 물어볼 예정)
app.get('/remaining', async (req, res) => {
    try {
        const remaining = await redis.get('tickets');
        res.json({ remaining: parseInt(remaining) || 0 });
    } catch (err) {
        res.status(500).json({ error: 'Redis Error' });
    }
});

// 2. [주문 API] 티켓 구매 (결제 척하는 딜레이 추가!)
app.post('/order', async (req, res) => {
    try {
        // 🔥 핵심: 실제 결제처럼 0.5초 ~ 1.5초 랜덤하게 기다림 (서버 부하 유도)
        const processingTime = Math.floor(Math.random() * 1000) + 500;
        await new Promise(resolve => setTimeout(resolve, processingTime));

        // 재고 감소 시도 (Atomic 연산)
        const result = await redis.decr('tickets');

        if (result >= 0) {
            res.json({ 
                message: "예매 성공! (결제 완료)", 
                remaining: result 
            });
            console.log(`[Order] Success! User: ${req.body.userId}, Remaining: ${result}`);
        } else {
            // 이미 0보다 작아졌으면 다시 0으로 돌려놓기 (음수 방지용 - 선택사항)
            // await redis.set('tickets', 0); 
            res.status(409).json({ message: "매진되었습니다! 😭" }); // 409 Conflict
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "서버 에러 발생" });
    }
});

app.listen(3000, () => {
    console.log('Ticket Backend listening on port 3000');
});