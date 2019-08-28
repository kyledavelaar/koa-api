const Router = require('koa-router')
const Ctrl = require('../controller/user');

const router = Router({
  prefix: '/api/users'
})

router.get('/', Ctrl.getUsers)

module.exports = router;