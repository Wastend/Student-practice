const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userModel.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const createUser = async (req, res) => {
    try {
        const newUser = await userModel.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.getUserByEmail(email);
        
        if (!user) {
            console.log('Пользователь не найден');
            return res.status(401).json({ message: 'Неверные учетные данные' });
        }

        // Сравнение пароля с хэшем
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Неверный пароль');
            return res.status(401).json({ message: 'Неверные учетные данные' });
        }

        const token = jwt.sign({ id: user.id, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Ошибка при входе:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const registerUser = async (req, res) => {
    const { username, email, password, role_id, company_name, company_website, company_description } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.createUser({
            username,
            email,
            password: hashedPassword,
            role_id,
            company_name: company_name || null,
            company_website: company_website || null,
            company_description: company_description || null,
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await userModel.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        res.json(user);
    } catch (error) {
        console.error('Ошибка при получении профиля:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { username, email, company_name, company_website, company_description } = req.body;
        const updatedUser = await userModel.updateUser(req.user.id, {
            username,
            email,
            company_name,
            company_website,
            company_description,
        });
        res.json(updatedUser);
    } catch (error) {
        console.error("Ошибка при обновлении профиля:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
};