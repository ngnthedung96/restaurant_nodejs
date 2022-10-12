import e from 'express';
import { check, body } from 'express-validator';
import { menu_foodDb } from '../dbs/menu_food.mjs'

const validate = (method) => {
    let err = [];
    switch (method) {
        case 'add': {
            err = [
                body('name', 'Tên không hợp lệ').exists().isLength({ min: 1 }).custom(value => {
                    return menu_foodDb.findByName(value, 'name').then(food => {
                        if (food) {
                            return Promise.reject('Tên đã được sử dụng');
                        }
                    });
                }),
                body('price', 'Giá không hợp lệ').exists().isLength({ min: 1 }),
                body('im_price', 'Giá gốc không hợp lệ').exists().isLength({ min: 1 }),
                body('type', 'Phân loại không hợp lệ').exists().isLength({ min: 1 }),
                body('number', 'Số lượng không hợp lệ').exists().isLength({ min: 1 }),
                body('img', 'Link ảnh không hợp lệ').exists().isLength({ min: 1 }),


            ]
        }
            break;
    }

    return err;
}

export default validate;