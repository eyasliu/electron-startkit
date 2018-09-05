/**
 * 打包成 windows 安装包程序
 * 
 * 鉴于该功能并不是常用，默认不安装相关依赖包，如果需要请手动安装一下
 * 
 * yarn add electron-winstaller
 * 
 */
const { say } = require('cfonts')
const chalk = require('chalk')
const path = require('path')
const installer = require('electron-winstaller')
const buildConfig = require('./build.config')
const npmPackage = require('../package.json')

const argv = process.argv
const is32Bit = argv.some(i => i === '--32')

say('winstaller', {
  colors: ['yellow'],
  font: 'simple3d',
  space: false
})

const doneLog = chalk.bgGreen.white(' DONE ') + ' '
const errorLog = chalk.bgRed.white(' ERROR ') + ' '
const okayLog = chalk.bgBlue.white(' OKAY ') + ' '
const buildingLog = chalk.bgBlue.white(' building ') + ' with electron-winstaller'

const building = installer.createWindowsInstaller({
  appDirectory: path.join(__dirname, '../', 'build/' + npmPackage.name + '-win32-x' + (is32Bit ? '32' : '64')),
  outputDirectory: buildConfig.out + '/win32-installer-x' + (is32Bit ? '32' : '64'),
  noMsi: false,
  version: npmPackage.version,
  authors: npmPackage.author,
  // exe: npmPackage.name
})

console.log(buildingLog)


building.then(() =>{
  console.log(doneLog)
})
.catch(err => {
  console.error(errorLog)
  console.error(err)
})
