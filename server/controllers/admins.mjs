import { adminDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';
import strtotime from "strtotime"
import moment from "moment"


const generateAccessToken = (admin) => {
    const adminId = admin.dataValues.id
    return jwt.sign({
        id: adminId
    },
        "secretAdminKey")
}
const generateRefreshToken = (admin) => {
    const adminId = admin.dataValues.id
    return jwt.sign({
        id: adminId
    },
        "secretAdminKey",
        {
            expiresIn: "365d"
        })
}
const register = async (req, res, next) => {
    const { phonenumber,
        email,
        password,
        name,
        shift,
        salary_hour,
        permission } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    try {
        let timeIn = null
        let timeOut = null
        if (Number(shift) === 0) {
            timeIn = strtotime(moment().format("YYYY-MM-DD 10:00"))
            timeOut = strtotime(moment().format("YYYY-MM-DD 15:00"))
        }
        else if (Number(shift) === 1) {
            timeIn = strtotime(moment().format("YYYY-MM-DD 18:00"))
            timeOut = strtotime(moment().format("YYYY-MM-DD 22:00"))
        }
        // if(shift === 2){
        //     timeIn = "10:00"
        //     timeOut = "14:00"
        // }
        const admin = await adminDb.register(phonenumber,
            email,
            password,
            name,
            timeIn,
            timeOut,
            salary_hour,
            permission);
        res.status(200).json({
            status: true,
            msg: 'Đăng ký thành công',
            data: {
                admin
            }
        });

        next()
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    try {
        const admin = await adminDb.findByPhoneNumber(req.body.phonenumber, 'phonenumber')
        generateAccessToken(admin)
        generateRefreshToken(admin)
        res.cookie("refreshToken", generateRefreshToken(admin), {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict"
        })
        res.status(200).json({
            status: true,
            msg: 'Đăng nhập thành công',
            admin,
            accessAdmintoken: generateAccessToken(admin)
        });
        next()
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
const reqRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken // lay ra token
    if (!refreshToken) {
        res.status(401), json("ban chua dang nhap")
    }
    else {
        //create new accesstoken, refresh token
        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict"
        })
        //can push newrefresh vao db
        res.status(200).json({
            accessToken: newAccessToken
        })
    }
}
const home = async (req, res, next) => {
    try {
        if (req.admin) {
            const admin = await adminDb.findById(req.admin.id, 'id')
            res.json({
                status: true,
                admin
            })
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
const logOut = async (req, res, next) => {
    try {
        res.clearCookie("refreshToken")
        res.json({
            status: true,
            msg: 'Đăng xuất thành công'
        })
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

const getInfor = async (req, res, next) => {
    try {
        const admin = await adminDb.findById(req.params.id, 'id')
        res.json({
            status: true,
            admin
        })
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

const getAdmin = async (req, res, next) => {
    try {
        if (req.admin) {
            const admin = await adminDb.findById(req.admin.id, 'id')
            res.json({
                status: true,
                admin
            })
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}


const getAdmins = async (req, res, next) => {
    try {
        if (req.admin) {
            const admins = await adminDb.findAll()
            res.json({
                status: true,
                admins
            })
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
const getAdminById = async (req, res, next) => {
    try {
        if (req.admin) {
            const { admin_id } = req.params
            const admin = await adminDb.findById(admin_id)
            res.json({
                status: true,
                admin
            })
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
const deleteAdmin = async (req, res, next) => {
    try {
        if (req.admin) {
            const admin = await adminDb.findById(req.admin.id)
            if (admin.dataValues.permission < 1) {
                const { admin_id } = req.params
                const admin = await adminDb.deleteById(admin_id)
                res.json({
                    status: true,
                    msg: "Xóa thành công"
                })
            }
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

const updateInfor = async (req, res, next) => {
    try {
        if (req.admin) {
            const { oldPass, newPass } = req.body
            const admin = await adminDb.findById(req.admin.id, 'id')
            if (oldPass === admin.dataValues.password) {
                await admin.update({
                    password: newPass
                })
                await admin.save()
                res.json({
                    status: true,
                    msg: 'Thay đổi mật khẩu thành công',
                    admin
                })
            }
            else {
                res.status(500).json({
                    status: true,
                    msg: 'Sai mật khẩu'
                })
            }
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}


export const adminController = {
    getAdminById,
    register,
    login,
    home,
    getInfor,
    updateInfor,
    logOut,
    getAdmin,
    getAdmins,
    deleteAdmin
}