import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { QueryRunner } from "typeorm";

const REQUIRED_TABLES = ["users", "user_preferences"];

export async function initDatabase() {
  if (!AppDataSource.isInitialized) {
    // initialise and create tables
    await AppDataSource.initialize();
  }

  await enableForeignKeysIfSqlite(); // apparently same as pragma

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    const missing: string[] = [];

    for (const tableName of REQUIRED_TABLES) {
      const exists = await hasTable(queryRunner, tableName);
      if (!exists) missing.push(tableName);
    }

    if (missing.length > 0) {
      console.log("Missing tables:", missing.join(", ")); // console missing tables
      await AppDataSource.synchronize(); // create missing tables if needed
      console.log("Missing tables created.");
    } else {
      console.log("All required tables already exist.");
    }
  } finally {
    await queryRunner.release();
  }
}

// Returns true if the table exists - use TypeORM query runner init with AppDataSource.createQueryRunner(); earlier
async function hasTable(
  queryRunner: QueryRunner,
  name: string
): Promise<boolean> {
  if (typeof (queryRunner as any).hasTable === "function") {
    return await (queryRunner as any).hasTable(name);
  }
  const table = await queryRunner.getTable(name);
  // !! converts to boolean of true or false
  return !!table;
}

async function enableForeignKeysIfSqlite() {
  const driver = AppDataSource.options.type;
  if (
    driver === "sqlite" ||
    driver === "better-sqlite3" ||
    driver === "capacitor"
  ) {
    await AppDataSource.query("PRAGMA foreign_keys = ON;");
  }
}