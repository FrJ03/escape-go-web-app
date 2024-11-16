import 'dotenv'
import { ClientConfig } from 'pg';

const PostgresSqlConfig = 
  (process.env.ENV === 'PROD') ? 
    {
      connectionString: process.env.PROD_POSTGRES_URL,
      ssl: true,
    } as ClientConfig
    :
    (process.env.ENV === 'DEV') ? 
      {
        connectionString: process.env.DEV_POSTGRES_URL,
        ssl: true,
      } as ClientConfig
      :
      {
        connectionString: process.env.TEST_POSTGRES_URL,
        ssl: true,
      } as ClientConfig

export default PostgresSqlConfig;