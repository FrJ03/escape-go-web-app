import dotenv from 'dotenv'

dotenv.config()

const ENV = process.env.ENV
const PORT = process.env.PORT
const POSTGRES_URL = 
    (ENV === 'prod') ? 
        process.env.PROD_POSTGRES_URL
    :
        (ENV === 'dev') ? 
            process.env.DEV_POSTGRES_URL
        :
            process.env.TEST_POSTGRES_URL

const SSL = (ENV !== 'test')

export { ENV, PORT, POSTGRES_URL, SSL }