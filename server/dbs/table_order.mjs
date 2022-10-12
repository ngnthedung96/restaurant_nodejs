import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'
import { Op } from 'sequelize'


// define tables
const Table_order = sequelize.define('Table_order', {
    table_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    timeIn: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timeOut: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    timePay: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {});

const createTable_Order = async (table_id, admin_id, user_id, timeIn) => {
    let res = null;
    try {
        res = await Table_order.create({
            table_id: Number(table_id),
            admin_id: Number(admin_id),
            user_id: Number(user_id),
            timeIn: Number(timeIn)
        }, { fields: ["table_id", "admin_id", "user_id", "price", "timeIn", "timeOut", "timePay"] });
    } catch (err) {
        logger.error(err)
    }
    return res;
}

const findAll = async (value, field) => {
    let res = null;
    try {
        res = await Table_order.findAll({
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const findAllByOrder = async (value, field) => {
    let res = null;
    try {
        res = await Table_order.findAll({
            attributes: ['admin_id']
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
        res = await Table_order.findOne({
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
const findByTableId = async (value, field) => {
    let res = null;
    try {
        res = await Table_order.findAll({
            where: {
                "table_id": value
            }
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const findByUserId = async (value, field) => {
    let res = null;
    try {
        res = await Table_order.findAll({
            where: {
                "user_id": value
            }
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const findBetween = async (timeStart, timeEnd, field) => {
    let res = null;
    try {
        const query = `SELECT * FROM Table_order WHERE timePay BETWEEN ${timeStart} AND ${timeEnd}`;
        res = await sequelize.query(query)
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}


export const table_orderDb = {
    findAll,
    findAllByOrder,
    findById,
    createTable_Order,
    findByTableId,
    findBetween,
    findByUserId
}