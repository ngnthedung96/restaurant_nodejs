import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'

// define tables
const Request_table = sequelize.define('Request_table', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    time_created: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    phonenumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    special_request: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

}, {});

const createRequestTable = async (username, user_id, phonenumber, time, time_created, quantity, specialRequest) => {
    let res = null;
    try {
        res = await Request_table.create({
            user_id: Number(user_id),
            username,
            quantity: Number(quantity),
            time: Number(time),
            time_created,
            phonenumber,
            special_request: specialRequest
        }, { fields: ["user_id", "username", "quantity", "time", 'time_created', "phonenumber", 'special_request', 'status'] });
    } catch (err) {
        logger.error(err)
    }
    return res;
}

const findAll = async (value, field) => {
    let res = null;
    try {
        res = await Request_table.findAll({
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
        const query = `SELECT * FROM Request_table WHERE time_created BETWEEN ${timeStart} AND ${timeEnd}`;
        res = await sequelize.query(query)
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}




const findById = async (value, field) => {
    let res = null;
    try {
        res = await Request_table.findAll({
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
const findByRequestId = async (value, field) => {
    let res = null;
    try {
        res = await Request_table.findOne({
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
const findByPhoneNumber = async (value, field) => {
    let res = null;
    try {
        res = await Request_table.findAll({
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


export const requestTableDb = {
    createRequestTable,
    findAll,
    findById,
    findByPhoneNumber,
    findBetween,
    findByRequestId
}