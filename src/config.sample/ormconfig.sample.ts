import { DataSourceOptions } from 'typeorm';

const configsample: DataSourceOptions = {

    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "",
    "database": "courses",
    "entities": ["dist/**/*.entity{.ts,.js}"],
    "dropSchema": false,
    "synchronize": true,
    "migrationsRun": false,
    "logging": true,
    "migrations":["dist/src//**/db/migrations/*{.ts,.js}"],
  }
  export default configsample;