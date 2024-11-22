import dotenv from 'dotenv'

dotenv.config()

const ENV = process.env.ENV
const PORT = process.env.PORT
const POSTGRES_URL = 
    (ENV === 'PROD') ? 
        process.env.PROD_POSTGRES_URL
    :
        (ENV === 'DEV') ? 
            process.env.DEV_POSTGRES_URL
        :
            process.env.TEST_POSTGRES_URL

export { ENV, PORT, POSTGRES_URL }