import { DB_PASSWORD, POSTGRES_URL } from '../../utils/config';
import { ClientConfig } from 'pg';

const PostgresSqlConfig = {
  connectionString: POSTGRES_URL,
  ssl: false,
  password: DB_PASSWORD
} as ClientConfig

export default PostgresSqlConfig;