import { POSTGRES_URL } from '../../utils/config';
import { ClientConfig } from 'pg';

const PostgresSqlConfig = {
  connectionString: POSTGRES_URL,
  ssl: true,
} as ClientConfig

export default PostgresSqlConfig;