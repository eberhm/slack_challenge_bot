module.exports = {
    "type": "mysql",
    "host": "0.0.0.0",
    "port": 3306,
    "username": "root",
    "password": "root",
    "database": "example_db",
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