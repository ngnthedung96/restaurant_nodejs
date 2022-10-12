import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'

// define tables
const Orders = sequelize.define('Orders', {
    table_order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    food_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    food_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {});

const createOrder = async (table_order_id, food_id, number, food_price, time) => {
    let res = null;
    try {
        res = await Orders.create({
            table_order_id,
            food_id,
            number,
            food_price,
            time
        }, { fields: ["table_order_id", "food_id", "number", "food_price", "time"] });
    } catch (err) {
        logger.error(err)
    }
    return res;
}

const findAll = async (value, field) => {
    let res = null;
    try {
        res = await Orders.findAll({
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}



const findByTOId = async (value, field) => {
    let res = null;
    try {
        res = await Orders.findAll({
            where: {
                "table_order_id": value
            }
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const findByTOIdTGO = async (value, food_id, field) => {
    let res = null;
    try {
        res = await Orders.findOne({
            where: {
                "table_order_id": value,
                "food_id": food_id
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
        res = await Orders.findOne({
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
const destroyOrder = async (value, field) => {
    let res = null;
    try {
        res = await Orders.destroy({
            where: {
                "table_order_id": value
            }
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}

export const orderDb = {
    findAll,
    findByTOId,
    createOrder,
    findById,
    destroyOrder,
    findByTOIdTGO
}