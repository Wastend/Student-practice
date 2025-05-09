const pool = require('../config/db');

const getAllUsers = async () => {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
};

const getUserById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
};

const createUser = async (user) => {
    const { username, email, password, role_id, company_name, company_website, company_description } = user;
    const [result] = await pool.query(
        'INSERT INTO users (username, email, password, role_id, company_name, company_website, company_description) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [username, email, password, role_id, company_name, company_website, company_description]
    );
    return { id: result.insertId, ...user };
};

const updateUser = async (id, user) => {
    const { username, email, company_name, company_website, company_description } = user;
    const [result] = await pool.query(
        'UPDATE users SET username = ?, email = ?, company_name = ?, company_website = ?, company_description = ? WHERE id = ?',
        [username, email, company_name, company_website, company_description, id]
    );
    return { id, ...user };
};

const getUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    getUserByEmail,
};