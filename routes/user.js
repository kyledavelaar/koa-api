const Router = require('koa-router')
const Ctrl = require('../controller/user');
const Middleware = require('../middleware/utils');

const router = new Router()

router.get(
  '/',
  Middleware.authenticate,
  Middleware.alterRequest,
  Ctrl.getUsers
)
router.get('/:id', Middleware.authenticate, Ctrl.getUser)
router.post(
  '/',
  Middleware.transferData,
  Ctrl.createUser
)
router.put('/:id', Ctrl.updateUser)
router.delete('/:id', Ctrl.deleteUser)

module.exports = router.routes();