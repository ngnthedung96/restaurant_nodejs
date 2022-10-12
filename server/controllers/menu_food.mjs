import { menu_foodDb } from '../dbs/menu_food.mjs'
import { adminDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';

const getMenu = async (req, res, next) => {
    try {
        if (req.admin) {
            const menu = await menu_foodDb.findAll()
            res.json({
                status: true,
                menu
            })
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
const addMenu = async (req, res, next) => {
    const { name, number, im_price, price, type, img } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    try {
        if (req.admin) {
            const menu = await menu_foodDb.addMenu(name, number, im_price, price, type, img)

            res.json({
                status: true,
                msg: "Thêm sản phẩm thành công",
                menu
            })
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

const deleteMenu = async (req, res, next) => {
    const { id } = req.params
    try {
        if (req.admin) {
            const menu = await menu_foodDb.deleteMenu(id)
            res.json({
                status: true,
                msg: "Xóa sản phẩm thành công",
                menu
            })
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
const updateMenu = async (req, res, next) => {
    const { img,
        price,
        id,
        name,
        number } = req.body
    try {
        if (req.admin) {
            const menu = await menu_foodDb.findById(id)
            if (menu) {
                await menu.update({
                    img,
                    price,
                    name,
                    number
                })
            }
            await menu.save()
            res.json({
                status: true,
                msg: "Cập nhật sản phẩm thành công",
                menu
            })
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}



export const menu_foodController = {
    getMenu,
    addMenu,
    deleteMenu,
    updateMenu
}