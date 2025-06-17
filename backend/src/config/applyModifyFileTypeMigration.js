const db = require('./db');
const fs = require('fs').promises;
const path = require('path');

async function applyMigration() {
    try {
        const migrationPath = path.join(__dirname, '../migrations/modify_file_type_column.sql');
        const migration = await fs.readFile(migrationPath, 'utf8');
        
        await db.execute(migration);
        console.log('Миграция успешно применена');
    } catch (error) {
        console.error('Ошибка при применении миграции:', error);
    } finally {
        process.exit();
    }
}

applyMigration(); 