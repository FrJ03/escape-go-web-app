import { POSTGRES_URL, SSL } from '../../utils/config';
import { ClientConfig } from 'pg';

const PostgresSqlConfig = {
  connectionString: POSTGRES_URL,
  ssl: SSL,
} as ClientConfig

export default PostgresSqlConfig;