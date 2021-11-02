require ('dotenv').config()

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: 'yew.arvixe.com',
    database: 'MarioStrikers',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        port: 443,
        cryptoCredentialsDetails: {
              minVersion: 'TLSv1'
          }
    }
}

module.exports = {config}
