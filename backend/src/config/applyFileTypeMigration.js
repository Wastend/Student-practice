const db = require('./db');
const fs = require('fs').promises;
const path = require('path');

async function applyMigration() {
    try {
        const migrationPath = path.join(__dirname, '../migrations/add_file_type_to_cover_letters.sql');
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