<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
    <main>
      <div class="left-side">
        <span class="title">
          Welcome to your new project!
        </span>
        <system-information></system-information>
      </div>

      <div class="right-side">
        <div class="doc">
          <div class="title">更新功能演示</div>
          <pre>
            {{version}}
          </pre>
          <button @click="checkUpdate">立即检查更新</button><br><br>
          <button v-if="status == 'update-downloaded'" @click="upgradeNow(true)">静默更新</button><br><br>
          <button v-if="status == 'update-downloaded'" @click="upgradeNow(false)">手动更新</button><br><br>

        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import ipc from '../service/ipc'
  console.log(ipc)
  export default {
    name: 'landing-page',
    data() {
      return {
        version: '未检查更新',
        status: 'wait',
      }
    },
    components: { SystemInformation },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      checkUpdate() {
        ipc.send({
          cmd: 'checkUpdate'
        }, true)
      },
      upgradeNow(isSlient) {
        ipc.send({
          cmd: 'upgradenow',
          body: {
            slient: isSlient,
            forceRun: false
          }
        })
      }
    },
    mounted() {
      // setInterval(() => {
      //   ipc.send({
      //     cmd: 'healthcheck'
      //   }).then(res => {
      //     console.log(res)
      //   }).catch(res => {
      //     console.log('error: ', res)
      //   })
      // }, 5000)

      ipc.on('versionupdate', body => {
        this.status = body.data.status
        console.log('versionupdate', body)
        this.version = JSON.stringify(body, null, 4)
      })
    }
  }
</script>

<style>
  /* @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro'); */

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
