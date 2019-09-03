const Router = require('koa-router')
const Ctrl = require('../controller/file');
const Middleware = require('../middleware/utils');

const router = new Router()

router.get('/', Ctrl.getFile)

router.post('/', Ctrl.writeStream)

module.exports = router.routes();