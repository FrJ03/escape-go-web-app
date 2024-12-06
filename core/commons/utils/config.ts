import dotenv from 'dotenv'

dotenv.config()

const ENV = process.env.ENV || 'prod'
const PORT = process.env.PORT || '3000'
const POSTGRES_URL = 
    (ENV === 'prod') ? 
        process.env.PROD_POSTGRES_URL || ''
    :
        (ENV === 'dev') ? 
            process.env.DEV_POSTGRES_URL || ''
        :
            process.env.TEST_POSTGRES_URL || ''

const SSL = (ENV !== 'test') || false
const SALT = process.env.SALT || 10

export { ENV, PORT, POSTGRES_URL, SSL, SALT }