import { table_orderDb } from '../dbs/table_order.mjs'
import { tableDb } from '../dbs/index.mjs'
import { adminDb } from '../dbs/index.mjs'
import { orderDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';
import strtotime from "strtotime"


const orderTables = async (req, res, next) => {
    try {
        if (req.admin) {
            // check permission
            const adminId = req.admin.id
            const admin = await adminDb.findById(adminId)
            if (admin.dataValues.permission <= 1) {
                const { table_id } = req.params
                //change status table
                const table = await tableDb.findById(table_id)
                await table.update({ status: 0 })
                await table.save()
                res.json({
                    status: true,
                    msg: "Đặt bàn thành công",
                    table
                })
            }
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

const deleteOrderTables = async (req, res, next) => {
    try {
        if (req.admin) {
            // check permission
            const adminId = req.admin.id
            const admin = await adminDb.findById(adminId)
            if (admin.dataValues.permission <= 1) {
                const { table_id } = req.params
                //change status table
                const table = await tableDb.findById(table_id)
                await table.update({ status: -1 })
                await table.save()
                res.json({
                    status: true,
                    msg: "Hủy đặt bàn thành công",
                    table
                })
            }
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

const usedTables = async (req, res, next) => {
    try {
        if (req.admin) {
            // check permission
            const adminId = req.admin.id
            const admin = await adminDb.findById(adminId)
            if (admin.dataValues.permission <= 1) {
                const { table_id, timeIn } = req.body
                const user_id = req.body.user_id
                // create table_order
                const timeInInt = strtotime(timeIn)
                if (user_id && user_id != 0) {
                    let check = null
                    const checkTOs = await table_orderDb.findByUserId(user_id)
                    for (let checkTO of checkTOs) {
                        if (Number(checkTO.dataValues.timeOut) === 0) {
                            check = 0
                        }
                    }
                    if (check !== 0) {
                        //change status table
                        const table = await tableDb.findById(table_id)
                        await table.update({ status: 1 })
                        await table.save()
                        const table_order = await table_orderDb.createTable_Order(table_id, adminId, user_id, timeInInt)
                        res.json({
                            status: true,
                            msg: "Chuyển trạng thái bàn thành công",
                            table_order
                        })
                    }
                    else {
                        res.status(400).json({
                            status: true,
                            msg: "Đang có khách hàng sử dụng tài khoản này"
                        })
                    }

                }
                else {
                    const table_order = await table_orderDb.createTable_Order(table_id, adminId, 0, timeInInt)
                    const table = await tableDb.findById(table_id)
                    await table.update({ status: 1 })
                    await table.save()
                    res.json({
                        status: true,
                        msg: "Chuyển trạng thái bàn thành công",
                        table_order
                    })
                }

            }
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
const getId = async (req, res, next) => {
    try {
        if (req.admin) {
            const table_orders = await table_orderDb.findByTableId(req.params.idOfTable)
            for (var table_order of table_orders) {
                if (table_order && !table_order.dataValues.timeOut && !table_order.dataValues.timePay) {
                    res.json({
                        status: true,
                        table_order
                    })
                }
            }
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}




const deleteUsedTables = async (req, res, next) => {
    try {
        if (req.admin) {
            // check permission
            const adminId = req.admin.id
            const admin = await adminDb.findById(adminId)
            if (admin.dataValues.permission <= 1) {
                const { id, table_id, timeOut } = req.params
                //change status table
                const table = await tableDb.findById(table_id)
                await table.update({ status: -1 })
                await table.save()
                // update timeOut
                const table_order = await table_orderDb.findById(id)
                const timeOutInt = strtotime(timeOut)
                await table_order.update({
                    timeOut: timeOutInt
                })
                await table_order.save()

                res.json({
                    status: true,
                    msg: "Hủy trạng thái bàn thành công",
                    table_order
                })
            }
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

const pay = async (req, res, next) => {
    try {
        if (req.admin) {
            // check permission
            const adminId = req.admin.id
            const admin = await adminDb.findById(adminId)
            if (admin.dataValues.permission <= 1) {
                const { id, table_id, timeOut, timePay } = req.params
                //change status table
                const table = await tableDb.findById(table_id)

                // find table_order and update timeOut timePay
                const table_order = await table_orderDb.findById(id)
                if (!table_order.dataValues.timePay || !table_order.dataValues.timeOut) {
                    await table.update({ status: -1 })
                    await table.save()


                    const timeOutInt = strtotime(timeOut)
                    const timePayInt = strtotime(timePay)
                    await table_order.update({
                        timeOut: timeOutInt,
                        timePay: timePayInt
                    })
                    await table_order.save()
                    res.json({
                        status: true,
                        msg: "Thanh toán bàn thành công",
                        table_order
                    })
                }
                else {
                    res.status(400).json({
                        status: true,
                        msg: "Bàn đã hủy hoặc đã thanh toán"
                    })
                }

            }
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

const showTableOrder = async (req, res, next) => {
    try {
        if (req.admin) {
            const timeStart = strtotime(req.params.timeStart)
            const timeEnd = strtotime(req.params.timeEnd)
            const table_orders = await table_orderDb.findBetween(timeStart, timeEnd)
            const table_orderArr = []
            for (let table_order of table_orders[0]) {
                const admin = await adminDb.findById(table_order.admin_id)
                const table = await tableDb.findById(table_order.table_id)
                table_orderArr.push({
                    adminName: admin.dataValues.name,
                    tableName: table.dataValues.name,
                    tableId: table.dataValues.id,
                    price: table_order.price,
                    table_orderId: table_order.id
                })
            }
            res.json({
                status: true,
                table_orderArr
            })

        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

export const table_orderController = {

    orderTables,
    deleteOrderTables,
    usedTables,
    deleteUsedTables,
    pay,
    getId,
    showTableOrder
}