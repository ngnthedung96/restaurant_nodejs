import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'

// define tables
const Users = sequelize.define('Users', {
    phonenumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dateOfBirth: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {});
const findByPassword = async (value, field) => {
    let res = null;
    try {
        res = await Users.findOne({
            where: {
                'password': value,
            }
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const findById = async (value, field) => {
    let res = null;
    try {
        res = await Users.findOne({
            where: {
                'id': value,
            }
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const findByEmail = async (value, field) => {
    let res = null;
    try {
        res = await Users.findOne({
            where: {
                'email': value,
            }
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const findByPhoneNumber = async (value, field) => {
    let res = null;
    try {
        res = await Users.findOne({
            where: {
                'phonenumber': value,
            }
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const register = async (phonenumber, email, password, name, gender, dateOfBirth, status) => {
    let res = null;
    try {
        res = await Users.create({
            phonenumber: phonenumber,
            email: email,
            password: password,
            name: name,
            gender: Number(gender),
            dateOfBirth: dateOfBirth
        }, { fields: ['phonenumber', 'email', 'password', 'name', 'gender', 'dateOfBirth', 'status'] });
    } catch (err) {
        logger.error(err)
    }
    return res;
}

const findUsers = async (value, field) => {
    let res = null;
    try {
        res = await Users.findAll()
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}

export const userDb = {
    register,
    findByEmail,
    findByPassword,
    findById,
    findUsers,
    findByPhoneNumber
}