import e from 'express';
import { check, body } from 'express-validator';
import { adminDb } from '../dbs/index.mjs'

const validate = (method) => {
  let err = [];
  switch (method) {
    case 'register': {
      err = [
        body('phonenumber', 'Số điện thoại không hợp lệ').exists().isLength({ min: 10 }).custom(value => {
          return adminDb.findByPhoneNumber(value, 'phonenumber').then(admin => {
            if (admin) {
              return Promise.reject('số điện thoại đã được sử dụng');
            }
          });
        }),
        body('password', 'Mật khẩu cần trên 7 kí tự').exists().isLength({ min: 7 }),
        body('email', 'Email không hợp lệ').exists().isEmail().custom(value => {
          return adminDb.findByEmail(value, 'email').then(admin => {
            if (admin) {
              return Promise.reject('Email đã được sử dụng');
            }
          });
        }),
        body('name', 'Tên không hợp lệ').exists().isLength({ min: 1 }),
        body('salary_hour', 'Lương theo giờ không hợp lệ').exists().isLength({ min: 1 }),
        body('permission', 'Phân quyền không hợp lệ').exists().isLength({ min: 1 }).isFloat({ min: 0, max: 2 })
      ]
    }
      break;
    case 'login': {
      var a
      err = [
        body('phonenumber', 'Số điện thoại không hợp lệ').exists().custom(value => {
          return adminDb.findByPhoneNumber(value, 'phonenumber').then(user => {
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
          return adminDb.findByEmail(value, 'email').then(admin => {
            if (admin) {
              return Promise.reject('Email đã được sử dụng');
            }
          });
        })
      ]
    }
      break;
    case 'addItem': {
      err = [
        body('name', 'Name không hợp lệ').exists().custom(value => {
          return itemsDb.findItemByName(value, 'name').then(item => {
            if (item) {
              return Promise.reject('Name đã được sử dụng');
            }
          });
        }),
        body('img').exists(),
        body('name').exists(),
        body('price').exists()
      ]
    }
      break;
    case 'addSale': {
      err = [
        body('code', 'Code không hợp lệ').exists().custom(value => {
          return codeDb.findCode(value, 'name').then(code => {
            if (!code) {
              return Promise.reject('Code không tồn tại');
            }
            else if (Number(code.number) === 0) {
              return Promise.reject('Code đã sử dụng hết ');
            }
          });
        }),
        body('user_id', 'ID khách hàng không hợp lệ').exists().custom(value => {
          return userDb.findById(value, 'id').then(user => {
            if (!user) {
              return Promise.reject('Khách hàng không tồn tại');
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