import { render } from "@testing-library/react";
import conn from "./app/db";
import * as fs from "fs";
import * as path from "path";

function getSqlFileContent(filePath: string): string {
  try {
    const absolutePath = path.resolve(__dirname, filePath);
    const sqlContent = fs.readFileSync(absolutePath, "utf-8");
    return sqlContent;
  } catch (error: any) {
    console.error(`Error reading file: ${error.message}`);
    throw error;
  }
}

const filePath = "../db-migrations.sql";
const sqlString = getSqlFileContent(filePath);

async () => {
  await conn.query(sqlString);
};
