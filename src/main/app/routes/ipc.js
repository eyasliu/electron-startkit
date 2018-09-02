module.exports = ({
  adapter: { ipc },
  controller: { machine }
}) => {
  ipc.router({
    'healthcheck': machine.healthcheck
  }, data => data.cmd)
}
