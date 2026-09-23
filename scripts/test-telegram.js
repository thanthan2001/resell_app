const fs = require('fs');

let token = process.env.TELEGRAM_BOT_TOKEN;
let chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  ['.env.local', '.env'].forEach(f => {
    if (fs.existsSync(f)) {
      fs.readFileSync(f, 'utf8').split('\n').forEach(l => {
        if (!token && l.startsWith('TELEGRAM_BOT_TOKEN=')) token = l.split('=')[1].trim();
        if (!chatId && l.startsWith('TELEGRAM_CHAT_ID=')) chatId = l.split('=')[1].trim();
      });
    }
  });
}

console.log('--- KIỂM TRA KẾT NỐI TELEGRAM BOT ---');
console.log('Chat ID đích:', chatId || '(chưa cấu hình)');
console.log('Token prefix:', token ? token.substring(0, 10) + '...' : '(chưa cấu hình)');

if (!token || !chatId) {
  console.error('❌ Thiếu biến TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID trong .env / .env.local');
  process.exit(1);
}

// 1. Kiểm tra Bot info qua getMe
fetch(`https://api.telegram.org/bot${token}/getMe`)
  .then(r => r.json())
  .then(me => {
    console.log('\n[1] Kết quả xác thực Bot (getMe):', me);
    if (!me.ok) {
      console.error('❌ Token Bot không hợp lệ (Lỗi ' + me.error_code + ': ' + me.description + ').');
      console.error('👉 Vui lòng mở @BotFather trên Telegram, gõ /token hoặc /mybots để lấy token mới và dán vào file .env.local!');
      return;
    }
    console.log(`✅ Kết nối Bot thành công! Tên bot: @${me.result?.username} (${me.result?.first_name})`);

    // 2. Thử gửi tin nhắn kiểm tra
    return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '🔔 <b>socialTech Bot Test</b>\nBot đã kết nối thành công và sẵn sàng nhận thông báo đơn hàng!',
        parse_mode: 'HTML'
      })
    })
    .then(r => r.json())
    .then(sendRes => {
      console.log('\n[2] Kết quả gửi tin nhắn thử:', sendRes);
      if (!sendRes.ok) {
        console.error(`❌ Không gửi được vào ${chatId}:`, sendRes.description);
        console.log('👉 Hướng dẫn: Đảm bảo bạn đã add Bot vào channel/group ' + chatId + ' và phân quyền Quản trị viên (Admin)!');
      } else {
        console.log('🎉 GỬI THÀNH CÔNG VỀ TELEGRAM!');
      }
    });
  })
  .catch(err => console.error('Lỗi mạng khi gọi Telegram API:', err));
