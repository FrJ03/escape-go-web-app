import pg from pg
import 'dotenv'

const { Client } = pg

const PostgresSqlClient = new Client({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT,
  idleTimeoutMillis: 30000,
});

export default PostgresSqlClient;