import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { UserPreferences } from "./entity/UserPreferences"
// used in other modules
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "weather_dashboard.db",
    synchronize: true,
    logging: false,
    entities: [User, UserPreferences],
    migrations: [],
    subscribers: [],
})
