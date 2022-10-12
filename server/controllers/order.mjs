import { table_orderDb } from '../dbs/index.mjs'
import { orderDb } from '../dbs/index.mjs'
import { menu_foodDb } from '../dbs/index.mjs'
import { logsDb } from '../dbs/index.mjs'
import { adminDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';
import strtotime from "strtotime"
import moment from "moment"


const updateOrder = async (req, res, next) => {
    try {
        if (req.admin) {
            //find admin
            const admin = await adminDb.findById(req.admin.id)

            const { orderArrs } = req.body
            const table_order = await table_orderDb.findById(orderArrs[0].table_order_id)
            if (table_order.dataValues.timePay == 0 || table_order.dataValues.timeOut == 0) {
                let checkNumberProLeft = null
                let checkNumberProOrdered = null
                for (var orderArr of orderArrs) {
                    const { order_id, food_id, addNumber, deleteNumber, time } = orderArr
                    const food = await menu_foodDb.findById(food_id)
                    const food_price = food.dataValues.price
                    if (addNumber > 0) {
                        //check pay
                        const checkOrder = await orderDb.findByTOIdTGO(table_order.dataValues.id, food_id)
                        if (!checkOrder) {
                            // change number product
                            const food_number = Number(food.dataValues.number) - Number(addNumber)
                            await food.update({ number: food_number })
                            await food.save()
                            // create order
                            const timeInt = strtotime(time)
                            const order = await orderDb.createOrder(table_order.dataValues.id, food_id, addNumber, food_price, timeInt)
                            //change price
                            const priceInTO = table_order.dataValues.price + (Number(addNumber) * Number(food_price))
                            await table_order.update({ price: priceInTO })
                            await table_order.save()

                            // convert time
                            const dateString = moment.unix(timeInt).format("DD/MM/YYYY HH:mm");
                            //create logs
                            await logsDb.createLog(table_order.dataValues.id, "Orders", `${admin.dataValues.name} đã thêm ${addNumber} ${food.dataValues.name} vào lúc ${dateString} `, timeInt)
                        }
                        else {
                            if (Number(food.dataValues.number) >= Number(addNumber)) {
                                const timeInt = strtotime(time)
                                // update order
                                await checkOrder.update({ number: Number(checkOrder.dataValues.number) + Number(addNumber) })
                                // change number product
                                const food_number = Number(food.dataValues.number) - Number(addNumber)
                                await food.update({ number: food_number })
                                await food.save()
                                //change price
                                const priceInTO = table_order.dataValues.price + (Number(addNumber) * Number(food_price))
                                await table_order.update({ price: priceInTO })
                                await table_order.save()

                                // convert time
                                const dateString = moment.unix(timeInt).format("DD/MM/YYYY HH:mm");
                                //create logs
                                await logsDb.createLog(table_order.dataValues.id, "Orders", `${admin.dataValues.name} đã thêm ${addNumber} ${food.dataValues.name} vào lúc ${dateString} `, timeInt)
                            }
                            else {
                                checkNumberProLeft = -1
                            }
                        }
                    }
                    else if (deleteNumber > 0) {
                        const order = await orderDb.findById(order_id)
                        if (order.dataValues.number > deleteNumber) {
                            const timeInt = strtotime(time)
                            await order.update({ number: order.dataValues.number - deleteNumber })
                            await order.save()
                            // change price
                            const priceInTO = table_order.dataValues.price - (Number(deleteNumber) * Number(food_price))
                            await table_order.update({ price: priceInTO })
                            await table_order.save()
                            // change number product
                            const food_number = Number(food.dataValues.number) + Number(deleteNumber)
                            await food.update({ number: food_number })
                            await food.save()

                            // convert time
                            const dateString = moment.unix(timeInt).format("DD/MM/YYYY HH:mm");

                            // create logs
                            await logsDb.createLog(table_order.dataValues.id, "Orders", `${admin.dataValues.name} đã xóa ${deleteNumber} ${food.dataValues.name} vào lúc ${dateString}`, timeInt)


                        }
                        else if (order.dataValues.number == deleteNumber) {
                            const timeInt = strtotime(time)
                            await order.destroy();
                            // change number product
                            const food_number = Number(food.dataValues.number) + Number(deleteNumber)
                            await food.update({ number: food_number })
                            await food.save()

                            // convert time
                            const dateString = moment.unix(timeInt).format("DD/MM/YYYY HH:mm");

                            // create logs
                            await logsDb.createLog(table_order.dataValues.id, "Orders", `${admin.dataValues.name} đã xóa ${deleteNumber} ${food.dataValues.name} vào lúc ${dateString}`, timeInt)
                        }
                        else {
                            checkNumberProOrdered = -1
                        }
                    }

                }
                if (checkNumberProLeft) {
                    res.status(400).json({
                        status: true,
                        msg: "Sản phẩm đã hết hàng"
                    })
                }
                else if (checkNumberProOrdered) {
                    res.status(400).json({
                        status: true,
                        msg: "Số lượng sản phẩm xóa lớn hơn số lượng đã có"
                    })
                }
                else {
                    res.json({
                        status: true,
                        msg: "Cập nhật thành công"
                    })
                }
            }
            else {
                res.status(400).json({
                    status: true,
                    msg: "Bàn đã hủy hoặc thanh toán"
                })

            }
        }

    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}


const showOrders = async (req, res, next) => {
    try {
        if (req.admin) {
            const orders = await orderDb.findByTOId(req.params.idOfTO)
            //get table_id
            if (orders.length > 0) {
                const table_order = await table_orderDb.findById(orders[0].dataValues.table_order_id)
                const orderArr = []
                for (var order of orders) {
                    const food = await menu_foodDb.findById(order.dataValues.food_id)
                    orderArr.push({ order, food })
                }
                res.json({
                    status: true,
                    orderArr,
                    table_id: table_order.dataValues.table_id
                })
            }
            else {
                res.json({
                    status: true,
                    orderArr: []
                })
            }

        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}





export const orderController = {
    updateOrder,
    showOrders
}