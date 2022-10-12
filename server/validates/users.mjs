import e from 'express';
import { check, body } from 'express-validator';
import { userDb } from '../dbs/index.mjs'

const validate = (method) => {
    let err = [];
    switch (method) {
        case 'register': {
            err = [
                body('phonenumber', 'Số điện thoại không hợp lệ').exists().isLength({ min: 10 }).custom(value => {
                    return userDb.findByPhoneNumber(value, 'phonenumber').then(user => {
                        if (user) {
                            return Promise.reject('số điện thoại đã được sử dụng');
                        }
                    });
                }),
                body('password', 'Mật khẩu cần trên 7 kí tự').exists().isLength({ min: 7 }),
                body('email', 'Email không hợp lệ').exists().isEmail().custom(value => {
                    return userDb.findByEmail(value, 'email').then(user => {
                        if (user) {
                            return Promise.reject('Email đã được sử dụng');
                        }
                    });
                }),
                body('name', 'Tên không hợp lệ').exists().isLength({ min: 1 }),
                body('gender', 'Giới tính không hợp lệ').exists().isLength({ min: 1 }),
                body('dateOfBirth', 'Ngày sinh không hợp lệ').exists().isLength({ min: 1 })
            ]
        }
            break;
        case 'login': {
            var a
            err = [
                body('phonenumber', 'Số điện thoại không hợp lệ').exists().custom(value => {
                    return userDb.findByPhoneNumber(value, 'phonenumber').then(user => {
                        if (!user) {
                            return Promise.reject('Số điện thoại không hợp lệ');
                        }
                        else {
                            a = user.dataValues.password
                        }
                    });
                }),
                body('password', 'Mật khẩu không hợp lệ').exists().isLength({ min: 7 }).custom(password => {
                    if (password === a) {
                        return true
                    }
                    else {
                        throw new Error('Mật khẩu không hợp lệ')
                    }
                })
            ]
        }
            break;
        case 'update': {
            err = [
                body('email', 'Email không hợp lệ').exists().isEmail().custom(value => {
                    return userDb.findByEmail(value, 'email').then(user => {
                        if (user) {
                            return Promise.reject('Email đã được sử dụng');
                        }
                    });
                })
            ]
        }
            break;
    }

    return err;
}

export default validate;