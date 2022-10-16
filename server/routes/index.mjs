import express from 'express'
import {
    logsController, userController, tableController, menu_foodController,
    table_orderController,
    orderController, requestTableController,
    timekeepingController
} from '../controllers/index.mjs'
import { adminController } from '../controllers/index.mjs'
import userValidate from '../validates/users.mjs'
import adminValidate from '../validates/admins.mjs'
import menuValidate from '../validates/menu.mjs'
import { tokenValidate } from '../validates/tokenValidate.mjs'

const router = express.Router() // create new router

//--------------------user------------------------------------
// create user
router.post('/users/register',
    userValidate('register'), // run valdiate
    userController.register
)
router.post('/users/login',
    userValidate('login'), // run valdiate
    userController.login
)
// router.post('/refreshToken',
//         tokenValidate.tokenAdminValidate.verifyToken, // run valdiate
// )
router.post('/users/logout',
    tokenValidate.tokenUserValidate.verifyToken,
    userController.logOut
)

router.get('/users/home',
    tokenValidate.tokenUserValidate.verifyToken,
    userController.home
)

router.get('/users/infor',
    tokenValidate.tokenUserValidate.verifyToken,
    userController.getInfor
)
router.get('/users/finduser/:phoneNumber',
    tokenValidate.tokenAdminValidate.verifyToken,

    userController.getUserByPhoneNumber
)
router.get('/users/findusers',
    tokenValidate.tokenAdminValidate.verifyToken,
    userController.showUsers
)


// request table
router.post('/users/requesttable/',
    requestTableController.createRequest
)
router.get('/users/requesttable/show/:timeStart&:timeEnd',
    tokenValidate.tokenUserValidate.verifyToken,
    requestTableController.showRequest
)
router.get('/admins/requesttable/show/:timeStart&:timeEnd',
    tokenValidate.tokenAdminValidate.verifyToken,
    requestTableController.showAllRequest
)
router.put('/admins/requesttable/acceptRequest/:id',
    tokenValidate.tokenAdminValidate.verifyToken,
    requestTableController.acceptRequest
)
router.put('/users/requesttable/changeRequest/:id',
    tokenValidate.tokenUserValidate.verifyToken,
    requestTableController.changeRequest
)
router.put('/admins/requesttable/refuseRequest/:id',
    tokenValidate.tokenAdminValidate.verifyToken,
    requestTableController.refuseRequest
)



//----------------------------------Admin------------------------------------------------
router.get('/admins/home',
    tokenValidate.tokenAdminValidate.verifyToken,
    adminController.getAdmin
)
router.get('/admins/showadmin/:admin_id',
    tokenValidate.tokenAdminValidate.verifyToken,
    adminController.getAdminById
)

router.get('/admins/showalladmins',
    tokenValidate.tokenAdminValidate.verifyToken,
    adminController.getAdmins
)

router.post('/admins/login',
    adminValidate('login'), // run valdiate
    adminController.login
)
router.post('/admins/register',
    adminValidate('register'), // run valdiate
    adminController.register
)

router.post('/admins/logout',
    tokenValidate.tokenAdminValidate.verifyToken,
    adminController.logOut
)
router.delete('/admins/delete/:admin_id',
    tokenValidate.tokenAdminValidate.verifyToken,
    adminController.deleteAdmin
)
router.post('/admins/changpassword/',
    tokenValidate.tokenAdminValidate.verifyToken,
    adminController.updateInfor
)

//table
router.get('/admins/table',
    tokenValidate.tokenAdminValidate.verifyToken,

    tableController.getTables
)

// menu

router.get('/admins/menu',
    menu_foodController.getMenu
)
router.post('/admins/menu/add',
    menuValidate('add'), // run valdiate,
    tokenValidate.tokenAdminValidate.verifyToken,

    menu_foodController.addMenu
)

router.delete('/admins/menu/delete/:id',
    tokenValidate.tokenAdminValidate.verifyToken,

    menu_foodController.deleteMenu
)
router.put('/admins/menu/update/',
    tokenValidate.tokenAdminValidate.verifyToken,

    menu_foodController.updateMenu
)

//table-order
router.put('/admins/table_order/order/:table_id',
    tokenValidate.tokenAdminValidate.verifyToken,
    table_orderController.orderTables
)
router.put('/admins/table_order/deleteOrder/:table_id',
    tokenValidate.tokenAdminValidate.verifyToken,
    table_orderController.deleteOrderTables
)
router.post('/admins/table_order/used',
    tokenValidate.tokenAdminValidate.verifyToken,
    table_orderController.usedTables
)
router.get('/admins/table_order/getId/:idOfTable',
    tokenValidate.tokenAdminValidate.verifyToken,
    table_orderController.getId
)
router.put('/admins/table_order/deleteUsed/:id&:table_id&:timeOut',
    tokenValidate.tokenAdminValidate.verifyToken,
    table_orderController.deleteUsedTables
)
router.put('/admins/table_order/pay/:id&:table_id&:timeOut&:timePay',
    tokenValidate.tokenAdminValidate.verifyToken,
    table_orderController.pay
)
router.get('/admins/table_order/show/:timeStart&:timeEnd',
    tokenValidate.tokenAdminValidate.verifyToken,
    table_orderController.showTableOrder
)

// order
router.post('/admins/order/create',
    tokenValidate.tokenAdminValidate.verifyToken,
    orderController.updateOrder
)
router.get('/admins/order/show/:idOfTO',
    tokenValidate.tokenAdminValidate.verifyToken,
    orderController.showOrders
)

//logs
router.get('/admins/logs/:idOfTO&:tableName',
    tokenValidate.tokenAdminValidate.verifyToken,
    logsController.getLogs
)


// create timekeeping
router.post('/admins/timekeeping/createtimein/',
    tokenValidate.tokenAdminValidate.verifyToken,
    timekeepingController.createTimeIn
)

router.post('/admins/timekeeping/createtimeout/',
    tokenValidate.tokenAdminValidate.verifyToken,
    timekeepingController.createTimeOut
)
router.get('/admins/timekeeping/show/:admin_id&:timeStart&:timeEnd',
    tokenValidate.tokenAdminValidate.verifyToken,
    timekeepingController.show
)

export default router;