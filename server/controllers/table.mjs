import { tableDb } from '../dbs/table.mjs'
import { adminDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';

const getTables = async (req, res, next) => {
    try {
        if (req.admin) {
            const adminId = req.admin.id
            const admin = await adminDb.findById(req.admin.id)
            if (admin.dataValues.permission === 0) {
                const tables = await tableDb.findAll()
                res.json({
                    status: true,
                    tables,
                    permission: admin.dataValues.permission
                })
            }
            else if (admin.dataValues.permission === 0) {
                const tables = await tableDb.findAll()
                res.json({
                    status: true,
                    tables,
                    permission: admin.dataValues.permission

                })
            }
            else {
                const tables = await tableDb.findAll()
                res.json({
                    status: true,
                    tables,
                    permission: admin.dataValues.permission
                })
            }

        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}


export const tableController = {
    getTables
}