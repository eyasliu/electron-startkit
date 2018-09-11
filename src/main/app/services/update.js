module.exports = app => {
  const updater = app.updater
  const { ipc } = app.adapter

  let message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新',
  }

  const sendUpdateMessage = data => {
    ipc.send({
      cmd: 'versionupdate',
      data: {
        ...data
      }
    })
  }

  updater.on('error', err => {
    sendUpdateMessage({
      status: 'error',
      message: message.error,
      error: err.message || err
    })
  })

  updater.on('checking-for-update', function () {
    sendUpdateMessage({
      status: 'checking-for-update',
      message: message.checking,
    })
  })
  updater.on('update-available', function (info) {
    sendUpdateMessage({
      status: 'update-available',
      message: message.updateAva,
      info,
    })
  })
  updater.on('update-not-available', function (info) {
    sendUpdateMessage({
      status: 'update-not-available',
      message: message.updateNotAva,
      info,
    })
  })

  // 更新下载进度事件
  updater.on('download-progress', function (progress) {
    sendUpdateMessage({
      status: 'download-progress',
      message: message.updateAva,
      progress,
    })
  })

  updater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    sendUpdateMessage({
      status: 'update-downloaded',
      message: '下载完成，是否立即安装更新',
      releaseNotes,
      releaseName,
      releaseDate,
      updateUrl,
    })
    // ipcMain.on('isUpdateNow', (e, arg) => {
    //   console.log(arguments)
    //   console.log('开始更新')
    //   // some code here to handle event
    //   updater.quitAndInstall()
    // })

    // mainWindow.webContents.send('isUpdateNow')
  })
}
