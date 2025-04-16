// This file contains definitions of database models and interaction with ORM (e.g., Sequelize).

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING);

// Define User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('student', 'employer', 'admin'),
        allowNull: false
    }
});

// Define Job model
const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    employerId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
});

// Define Application model
const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    studentId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    jobId: {
        type: DataTypes.INTEGER,
        references: {
            model: Job,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('applied', 'interview', 'hired', 'rejected'),
        allowNull: false
    }
});

// Sync models with the database
const initModels = async () => {
    await sequelize.sync();
};

module.exports = {
    User,
    Job,
    Application,
    initModels
};