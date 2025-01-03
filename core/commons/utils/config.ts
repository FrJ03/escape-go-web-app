import dotenv from 'dotenv'

dotenv.config()

const ENV = process.env.ENV || 'prod'
const PORT = process.env.PORT || '3000'
const DB_PASSWORD = process.env.DB_PASSWORD || ''
const POSTGRES_URL = 
    (ENV === 'prod') ? 
        process.env.PROD_POSTGRES_URL || ''
    :
        (ENV === 'dev') ? 
            process.env.DEV_POSTGRES_URL || ''
        :
            process.env.TEST_POSTGRES_URL || ''

const SSL = (ENV !== 'test') || false
let s
if(process.env.SALT !== undefined && Number.isInteger(process.env.SALT)){
    s = process.env.SALT
}
else{
    s = 10
}
const SALT = s
const PASS = process.env.PASS || 'password'
const LAUNCH_DATE = process.env.LAUNCH_DATE || '2025-01-01'

export { ENV, PORT, POSTGRES_URL, SSL, SALT, PASS, LAUNCH_DATE, DB_PASSWORD }