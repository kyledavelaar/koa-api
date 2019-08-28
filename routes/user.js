const Router = require('koa-router')
const Ctrl = require('../controller/user');

const router = new Router()

router.get('/', Ctrl.getUsers)
router.post('/', Ctrl.createUser)

module.exports = router.routes();