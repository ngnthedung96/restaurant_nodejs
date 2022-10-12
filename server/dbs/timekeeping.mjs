import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'

// define tables
const Timekeeping = sequelize.define('Timekeeping', {
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timeIn: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timeOut: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {});

const createTimeIn = async (admin_id, timeIn, timeOut) => {
    let res = null;
    try {
        res = await Timekeeping.create({
            admin_id,
            timeIn
        }, { fields: ["admin_id", "timeIn", "timeOut"] });
    } catch (err) {
        logger.error(err)
    }
    return res;
}

const findByAdminId = async (admin_id, field) => {
    let res = null;
    try {
        res = await Timekeeping.findAll({
            where: {
                "admin_id": admin_id,
            }
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const findById = async (id, field) => {
    let res = null;
    try {
        res = await Timekeeping.findOne({
            where: {
                "id": id,
            }
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const findBetweenDays = async (timeStart, timeEnd, field) => {
    let res = null;
    try {
        const query = `SELECT * FROM Timekeeping WHERE timeIn BETWEEN ${timeStart} AND ${timeEnd}`;
        res = await sequelize.query(query)
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const findBetweenDaysOfStaff = async (admin_id, timeStart, timeEnd, field) => {
    let res = null;
    try {
        const query = `SELECT * FROM Timekeeping WHERE admin_id = ${admin_id} and timeIn BETWEEN ${timeStart} AND ${timeEnd}`;
        res = await sequelize.query(query)
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}

export const timekeepingDb = {
    createTimeIn,
    findByAdminId,
    findBetweenDays,
    findById,
    findBetweenDaysOfStaff
}