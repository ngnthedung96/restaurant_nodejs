import { table_orderDb } from '../dbs/index.mjs'
import { timekeepingDb } from '../dbs/index.mjs'
import { orderDb } from '../dbs/index.mjs'
import { menu_foodDb } from '../dbs/index.mjs'
import { logsDb } from '../dbs/index.mjs'
import { adminDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';
import strtotime from "strtotime"
import moment from "moment"


const createTimeIn = async (req, res, next) => {
    try {
        if (req.admin) {
            //check last day 
            let today = moment(new Date());
            let lastDay = moment(new Date()).subtract(1, 'day')
            const timeStart = lastDay.format('YYYY-MM-DD 00:00')
            const timeEnd = today.format('YYYY-MM-DD 00:00')
            const timeStartInt = strtotime(timeStart)
            const timeEndInt = strtotime(timeEnd)
            const timekeepingscheck = await timekeepingDb.findBetweenDays(timeStartInt, timeEndInt)
            let id = null
            for (let timekeeping of timekeepingscheck[0]) {
                if (Number(timekeeping.timeOut) === 0) {
                    id = timekeeping.id
                }
            }
            if (id) {
                const timekeeping = await timekeepingDb.findById(id)
                await timekeeping.update({ timeOut: 1 })
                await timekeeping.save()
            }
            const { admin_id, timeIn } = req.body
            const timeInt = strtotime(timeIn)
            const timekeepings = await timekeepingDb.findByAdminId(admin_id)
            let check = null
            for (let timekeeping of timekeepings) {
                if (Number(timekeeping.dataValues.timeOut) === 0) {
                    check = timekeeping
                }
            }
            if (check) {
                res.status(400).json({
                    status: true,
                    msg: "Đã vào ca hoặc chưa có kết ca"
                })
            }
            else {
                const timekeeping = await timekeepingDb.createTimeIn(admin_id, timeInt)
                res.json({
                    status: true,
                    msg: "Vào ca thành công",
                    timekeeping
                })
            }
        }

    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

const createTimeOut = async (req, res, next) => {
    try {
        if (req.admin) {
            const { admin_id, timeOut } = req.body
            const timeInt = strtotime(timeOut)
            const timekeepings = await timekeepingDb.findByAdminId(admin_id)
            let createTimeOut = null
            for (let timekeeping of timekeepings) {
                if (Number(timekeeping.dataValues.timeOut) === 0) {
                    createTimeOut = timekeeping
                }
            }
            if (createTimeOut) {
                await createTimeOut.update({ timeOut: timeInt })
                await createTimeOut.save()
                res.json({
                    status: true,
                    msg: "Kết ca thành công"
                })
            }
            else {
                res.status(400).json({
                    status: true,
                    msg: "Chưa vào ca"
                })
            }
        }

    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
// const check = async (req, res, next) => {
//     try {
//         if (req.admin) {
//             //check last day 
//             let today = moment(new Date());
//             let lastDay = moment(new Date()).subtract(1, 'day')
//             const timeStart = lastDay.format('YYYY-MM-DD 00:00')
//             const timeEnd = today.format('YYYY-MM-DD 00:00')
//             const timeStartInt = strtotime(timeStart)
//             const timeEndInt = strtotime(timeEnd)
//             const timekeepings = await timekeepingDb.findBetweenDays(timeStartInt, timeEndInt)
//             let id = null
//             for (let timekeeping of timekeepings[0]) {
//                 if (Number(timekeeping.timeOut) === 0) {
//                     id = timekeeping.id
//                 }
//             }
//             if (id) {
//                 const timekeeping = await timekeepingDb.findById(id)
//                 await timekeeping.update({ timeOut: 1 })
//                 await timekeeping.save()
//             }

//             //check today
//             const timekeepingsOfAdmin = await timekeepingDb.findByAdminId(admin_id)
//             let createTimeOut = null
//             for (let timekeeping of timekeepingsOfAdmin) {
//                 if (Number(timekeeping.dataValues.timeOut) === 0) {
//                     createTimeOut = timekeeping
//                 }
//             }
//             if (createTimeOut) {
//                 res.json({
//                     status: false,
//                     createTimeOut
//                 })
//             }
//             else {
//                 res.json({
//                     status: true
//                 })
//             }
//         }
//     } catch (e) {
//         console.log(e.message)
//         res.sendStatus(500) && next(e)
//     }
// }
const show = async (req, res, next) => {
    try {
        if (req.admin) {
            const { admin_id, timeStart, timeEnd } = req.params
            const timeStartInt = strtotime(timeStart)
            const timeEndInt = strtotime(timeEnd)
            const timekeepings = await timekeepingDb.findBetweenDaysOfStaff(admin_id, timeStartInt, timeEndInt)
            res.json({
                status: true,
                timekeeping: timekeepings[0]
            })

        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}






export const timekeepingController = {
    createTimeIn,
    createTimeOut,
    show
}