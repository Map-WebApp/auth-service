import axios from 'axios';
import bcrypt from 'bcrypt';

// Người dùng mẫu để tạo
const defaultUsers = [
  { username: 'test123', password: 'test123' },
  { username: 'hoaiphu', password: 'test123' }
];

// URL của user-service 
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:8080';

async function seedUsers() {
  console.log('🌱 Bắt đầu tạo người dùng mặc định...');
  
  for (const user of defaultUsers) {
    try {
      // Thử đăng ký người dùng 
      const response = await axios.post(`${USER_SERVICE_URL}/api/users/register`, user);
      console.log(`✅ Đã tạo thành công người dùng: ${user.username}`);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log(`ℹ️ Người dùng ${user.username} đã tồn tại, bỏ qua.`);
      } else {
        console.error(`❌ Không thể tạo người dùng ${user.username}:`, error.message);
      }
    }
  }
  
  console.log('✅ Đã hoàn thành việc tạo người dùng mặc định.');
}

// Chờ vài giây để user-service khởi động hoàn tất
setTimeout(() => {
  seedUsers().catch(err => {
    console.error('❌ Lỗi khi chạy script tạo người dùng:', err);
  });
}, 10000); // Đợi 10 giây 