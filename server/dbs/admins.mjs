import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'


// define tables
const Admins = sequelize.define('Admins', {
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
  timeIn: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  timeOut: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  salary_hour: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  permission: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {});
const register = async (phonenumber, email, password, name, timeIn, timeOut, salary_hour, permission, status) => {
  let res = null;
  try {
    res = await Admins.create({
      phonenumber: phonenumber,
      email: email,
      password: password,
      name: name,
      timeIn,
      timeOut,
      salary_hour,
      permission
    }, { fields: ['phonenumber', 'email', 'password', 'name', 'timeIn', 'timeOut', 'salary_hour', 'permission', 'status'] });
  } catch (err) {
    logger.error(err)
  }
  return res;
}
const findByPhoneNumber = async (value, field) => {
  let res = null;
  try {
    res = await Admins.findOne({
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
const findByPassword = async (value, field) => {
  let res = null;
  try {
    res = await Admins.findOne({
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
    res = await Admins.findOne({
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
const findAll = async (value, field) => {
  let res = null;
  try {
    res = await Admins.findAll({

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
    res = await Admins.findOne({
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
const deleteById = async (value, field) => {
  let res = null;
  try {
    res = await Admins.destroy({
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


export const adminDb = {
  findByPhoneNumber,
  findByEmail,
  findByPassword,
  findById,
  findAll,
  register,
  deleteById
}