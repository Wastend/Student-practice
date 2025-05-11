const tagModel = require('../models/tagModel');

const getAllTags = async (req, res) => {
    try {
        const tags = await tagModel.getAllTags();
        res.json(tags);
    } catch (error) {
        console.error("Ошибка при получении тегов:", error);
        res.status(500).json({ message: "Ошибка при получении тегов" });
    }
};

const createTag = async (req, res) => {
    try {
        const { name } = req.body;
        const tag = await tagModel.createTag(name);
        res.status(201).json(tag);
    } catch (error) {
        console.error("Ошибка при создании тега:", error);
        res.status(500).json({ message: "Ошибка при создании тега" });
    }
};

module.exports = {
    getAllTags,
    createTag
}; 