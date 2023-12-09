import { DataSource } from "typeorm";
import DataOptions from "./ormconfig";

export const AppDataSource = new DataSource(DataOptions);