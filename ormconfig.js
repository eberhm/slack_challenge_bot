require('dotenv').config()

module.exports = {
    "type": "mysql",
    "host": process.env.SLACK_CC_MYSQL_DATABASE_HOST,
    "port": process.env.SLACK_CC_MYSQL_LOCAL_PORT,
    "username": "root",
    "password": process.env.SLACK_CC_MYSQL_ROOT_PASSWORD,
    "database": process.env.SLACK_CC_MYSQL_DATABASE,
    "synchronize": true,
    "logging": false,
    "entities": [
       "./src/Infrastructure/db/entity/**/*.ts"
    ],
    "migrations": [
       "./src/Infrastructure/db/migrations/**/*.ts"
    ],
    "subscribers": [
       "src/Infrastructure/db/subscriber/**/*.ts"
    ]
 }