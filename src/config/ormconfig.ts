import "dotenv/config";
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

 const DataOptions: MysqlConnectionOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "courses",
    entities: ["dist/**/*.entity{.ts,.js}",],
    dropSchema: false,
    synchronize: true,
    migrationsRun: false,
    logging: true,
    migrations:[
        "dist/src//**/db/migrations/*{.ts,.js}",
        "dist/modules//**/db/migrations/*{.ts,.js}",
        "dist/db/migrations/*{.ts,.js}"
    ]
};
export default DataOptions;