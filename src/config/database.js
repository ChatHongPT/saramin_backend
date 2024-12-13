import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/saramin_crawler';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 서버 선택 타임아웃
      socketTimeoutMS: 45000, // 소켓 타임아웃
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // 연결 이벤트 리스너 추가
    mongoose.connection.on('error', err => {
      console.error('MongoDB 연결 에러:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB 연결이 끊어졌습니다. 재연결을 시도합니다.');
      setTimeout(connectDB, 5000); // 5초 후 재연결 시도
    });

  } catch (error) {
    console.error('MongoDB 연결 실패:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB 연결이 종료되었습니다.');
  } catch (error) {
    console.error('MongoDB 연결 종료 실패:', error.message);
  }
};

export { connectDB, disconnectDB };