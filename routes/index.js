module.exports = router => {
  router.prefix('/api')
  router.use('/users', require('./user'))
  router.use('/file', require('./file'))
}