import { type SQLiteDatabase } from "expo-sqlite"

export async function initializeDatabase(database: SQLiteDatabase){
    await database.execAsync(`

            CREATE TABLE IF NOT EXISTS products(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                quantity INTEGER NOT NULL
            );

        `)
}

//DROP table products;

// INSERT INTO products (name, quantity) VALUES ('Produto 2', 5);