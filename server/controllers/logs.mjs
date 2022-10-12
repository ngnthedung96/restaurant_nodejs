import { logsDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';
import strtotime from "strtotime"



const getLogs = async (req, res, next) => {
    try {
        if (req.admin) {
            const table_name = req.params.tableName
            const idOfTO = req.params.idOfTO
            const logs = await logsDb.findAll(idOfTO, table_name)
            res.json({
                status: true,
                logs
            })
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}




export const logsController = {
    getLogs
}