module.exports = app => ({
  data: {
    current: {},
    isLogin: false
  },
  computed: {
    uid() {
      return this.isLogin ? this.current.id : 0
    }
  },
  methods: {
    login(user) {
      this.current = user
      this.isLogin = true
    },
  },
})
