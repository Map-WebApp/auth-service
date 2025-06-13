
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Redis from 'ioredis';

const router = express.Router();
const redis = new Redis(process.env.REDIS_URL);

const usersKey = 'users';

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Thiếu thông tin' });

  const hash = await bcrypt.hash(password, 10);
  await redis.hset(usersKey, username, hash);
  res.json({ message: 'Đăng ký thành công' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const hash = await redis.hget(usersKey, username);
  if (!hash || !(await bcrypt.compare(password, hash))) return res.status(401).json({ message: 'Sai thông tin' });

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

export default router;
