import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'

// define tables
const Logs = sequelize.define('Logs', {
    pk_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    table_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    logs: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {});

const createLog = async (pk_id, table_name, logs, time) => {
    let res = null;
    try {
        res = await Logs.create({
            pk_id,
            table_name,
            logs,
            time
        }, { fields: ["pk_id", "table_name", "logs", "time"] });
    } catch (err) {
        logger.error(err)
    }
    return res;
}

const findAll = async (idOfTO, table_name, field) => {
    let res = null;
    try {
        res = await Logs.findAll({
            where: {
                "pk_id": idOfTO,
                "table_name": table_name
            }
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}

export const logsDb = {
    findAll,
    createLog
}