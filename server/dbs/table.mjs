import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'

// define tables
const Tables = sequelize.define('Tables', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {});

const findAll = async (value, field) => {
    let res = null;
    try {
        res = await Tables.findAll({
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
        res = await Tables.findOne({
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
const findAllByOrder = async (value, field) => {
    let res = null;
    try {
        res = await Tables.findAll({
            attributes: ['name']
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}

export const tableDb = {
    findAll,
    findAllByOrder,
    findById
}