const db = require('../config/database');

class Task {
    constructor() {
        this.tableName = 'tasks';
    }

    async create(taskData) {
        const { vacancy_id, description, file_url } = taskData;
        const query = `
            INSERT INTO ${this.tableName} (vacancy_id, description, file_url, status)
            VALUES (?, ?, ?, 'pending')
        `;
        const [result] = await db.execute(query, [vacancy_id, description, file_url]);
        return result.insertId;
    }

    async getByVacancyId(vacancyId) {
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE vacancy_id = ?
            ORDER BY created_at DESC
        `;
        const [tasks] = await db.execute(query, [vacancyId]);
        return tasks;
    }

    async getById(id) {
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE id = ?
        `;
        const [tasks] = await db.execute(query, [id]);
        return tasks[0];
    }

    async submitResponse(taskId, studentId, response, fileUrl) {
        const query = `
            UPDATE ${this.tableName}
            SET student_response = ?,
                student_response_file_url = ?,
                student_id = ?,
                status = 'submitted'
            WHERE id = ? AND status = 'pending'
        `;
        const [result] = await db.execute(query, [response, fileUrl, studentId, taskId]);
        return result.affectedRows > 0;
    }

    async updateStatus(taskId, status) {
        const query = `
            UPDATE ${this.tableName}
            SET status = ?
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [status, taskId]);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const query = `
            DELETE FROM ${this.tableName}
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new Task(); 