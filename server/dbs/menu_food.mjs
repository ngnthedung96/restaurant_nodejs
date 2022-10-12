import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'

// define tables
const Menu_food = sequelize.define('Menu_food', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    im_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    img: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {});

const addMenu = async (name, number, im_price, price, type, img) => {
    let res = null;
    try {
        res = await Menu_food.create({
            name, price, im_price, number, img, type
        }, { fields: ['name', 'number', "im_price", 'price', 'img', 'type'] });
    } catch (err) {
        logger.error(err)
    }
    return res;
}

const findAll = async (value, field) => {
    let res = null;
    try {
        res = await Menu_food.findAll({
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const findByName = async (value, field) => {
    let res = null;
    try {
        res = await Menu_food.findOne({
            where: {
                "name": value
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
        res = await Menu_food.findOne({
            where: {
                "id": value
            }
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}


const deleteMenu = async (value, field) => {
    let res = null;
    try {
        res = await Menu_food.destroy(
            {
                where: { "id": value },
            })
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const findAllByOrder = async (value, field) => {
    let res = null;
    try {
        res = await Menu_food.findAll({
            attributes: ['name']
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}

export const menu_foodDb = {
    findAll,
    findAllByOrder,
    addMenu,
    findByName,
    deleteMenu,
    findById
}