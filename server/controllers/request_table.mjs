import { userDb, adminDb } from '../dbs/index.mjs'
import { requestTableDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';
import strtotime from "strtotime"
import moment from "moment"





const createRequest = async (req, res, next) => {
    try {
        const { userName, user_id, phoneNumber, time, quantity, specialRequest } = req.body
        if (user_id == 0) {
            const user = await userDb.findByPhoneNumber(phoneNumber)
            if (user) {
                res.status(500).json({
                    status: true,
                    msg: "Đã có tài khoản sử dụng số điện thoại này. Vui lòng đăng nhập"
                })
            }
            else {
                const timeCreated = strtotime(moment().format("YYYY-MM-DD HH:mm"))
                const timeInt = strtotime(time)
                let requests = await requestTableDb.findByPhoneNumber(phoneNumber)
                let check = null
                if (requests) {
                    for (let request of requests) {
                        if (request.dataValues.status === 0) {
                            check = 1
                        }
                    }
                }
                if (!check) {
                    const requestTable = await requestTableDb.createRequestTable(userName, user_id, phoneNumber, timeInt, timeCreated, quantity, specialRequest)
                    res.json({
                        status: true,
                        msg: "Gửi yêu cầu đặt bàn thành công",
                        requestTable
                    })
                }
                else {
                    res.status(400).json({
                        status: true,
                        msg: "Yêu cầu đặt bàn của bạn đang được duyệt"
                    })
                }
            }
        }
        else {
            const timeCreated = strtotime(moment().format("YYYY-MM-DD HH:mm"))
            const timeInt = strtotime(time)
            let requests = await requestTableDb.findByPhoneNumber(phoneNumber)
            let check = null
            if (requests) {
                for (let request of requests) {
                    if (request.dataValues.status === 0) {
                        check = 1
                    }
                }
            }
            if (!check) {
                const requestTable = await requestTableDb.createRequestTable(userName, user_id, phoneNumber, timeInt, timeCreated, quantity, specialRequest)
                res.json({
                    status: true,
                    msg: "Gửi yêu cầu đặt bàn thành công",
                    requestTable
                })
            }
            else {
                res.status(400).json({
                    status: true,
                    msg: "Yêu cầu đặt bàn của bạn đang được duyệt"
                })
            }
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

const showRequest = async (req, res, next) => {
    try {
        if (req.user) {
            const requests = await requestTableDb.findById(req.user.id)
            res.json({
                status: true,
                requests
            })
        }

    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
const showAllRequest = async (req, res, next) => {
    try {
        if (req.admin) {
            const admin = await adminDb.findById(req.admin.id)
            if (admin.dataValues.permission <= 1) {
                const { timeStart, timeEnd } = req.params
                const timeStartInt = strtotime(timeStart)
                const timeEndInt = strtotime(timeEnd)
                const requests = await requestTableDb.findBetween(timeStartInt,
                    timeEndInt)
                res.json({
                    status: true,
                    requests: requests[0]
                })
            }
            else {
                res.json({
                    status: true
                })
            }
        }

    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
const acceptRequest = async (req, res, next) => {
    try {
        if (req.admin) {
            const { id } = req.params
            const request = await requestTableDb.findByRequestId(id)
            await request.update({ status: 1 })
            await request.save()
            res.json({
                status: true,
                request
            })
        }

    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
const refuseRequest = async (req, res, next) => {
    try {
        if (req.admin) {
            const { id } = req.params
            const request = await requestTableDb.findByRequestId(id)
            await request.update({ status: -1 })
            await request.save()
            res.json({
                status: true,
                request
            })
        }

    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}







export const requestTableController = {
    createRequest,
    showRequest,
    showAllRequest,
    acceptRequest,
    refuseRequest
}