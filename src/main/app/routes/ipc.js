module.exports = ({
  adapter: { ipc },
  controller: { machine }
}) => {
  console.log(machine)
  ipc.router({
    'healthcheck': machine.healthcheck
  }, data => data.cmd)
}
