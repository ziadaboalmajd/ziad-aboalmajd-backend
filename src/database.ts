import { Pool } from 'pg';
import dotenv from 'dotenv';


dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_TEST_DB,
  POSTGRES_PORT,
  ENV,
  BCRYPT_PASSWORD,
  SALT_ROUNDS,
  MYSQL,
  JWT_KEY,
} = process.env;

const pool = new Pool({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  password: POSTGRES_PASSWORD,
  database: ENV === 'dev' ? POSTGRES_DB : POSTGRES_TEST_DB,
  port: Number(POSTGRES_PORT),
  keepAlive: true
});

export default pool;
