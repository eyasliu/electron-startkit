module.exports = ({
  router,
  adapter: { ipc },
  controller: { machine }
}) => {
  router.register(ipc, data => data.cmd, {
    'healthcheck': machine.healthcheck
  })
}
