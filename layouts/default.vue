<template>
  <div :class="layoutClasses">
    <TopBar @toggleTheme="toggleTheme" />
    <Nuxt />
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      dark: false
    }
  },
  computed: {
    layoutClasses() {
      let c = 'default-layout'
      if ( this.dark ) {
        c += ' dark'
      }
      return c
    }
  },
  methods: {
    setDark() {
      console.log('setting dark')
      this.dark = true
      if ( process.client ) {
        console.log('browser client, setting dark')
        document.cookie = "kelleher_theme=dark; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;";
        document.documentElement.className = 'dark'
      }
    },
    setLight() {
      console.log('setting light')
      this.dark = false
      if ( process.client ) {
        console.log('browser client, setting light')
        document.cookie = "kelleher_theme=; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;";
        document.documentElement.className = ''
      }
    },
    toggleTheme() {
      if ( this.dark ) {
        this.setLight()
      } else {
        this.setDark()
      }
    }
  },
  created() {
    if ( process.client ) {
      let cookie = document.cookie.split('; ').find(row => row.startsWith('kelleher_theme='))
      let cookie_value = (cookie) ? cookie.split('=')[1] : ''
      this.dark = cookie_value === 'dark';

      if ( this.dark ) {
        this.setDark()
      }
    }
  }
}
</script>

<style scoped>
.default-layout {
    margin-top: 60px;
}
</style>
