import { table_orderDb } from '../dbs/index.mjs'
import { requestTableDb } from '../dbs/index.mjs'
import { orderDb } from '../dbs/index.mjs'
import { menu_foodDb } from '../dbs/index.mjs'
import { logsDb } from '../dbs/index.mjs'
import { adminDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';
import strtotime from "strtotime"
import moment from "moment"





const createRequest = async (req, res, next) => {
    try {
        const { userName, user_id, phoneNumber, time, quantity, specialRequest } = req.body
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