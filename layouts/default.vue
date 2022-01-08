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
    layoutClasses () {
      let c = 'default-layout'
      if (this.dark) {
        c += ' dark'
      }
      return c
    }
  },
  created () {
    this.themeOnCreated()
  },
  methods: {
    setDark () {
      this.dark = true
      if (process.client) {
        document.cookie = 'kelleher_theme=dark; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;'
        document.documentElement.className = 'dark'
      }
    },
    setLight () {
      this.dark = false
      if (process.client) {
        document.cookie = 'kelleher_theme=; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;'
        document.documentElement.className = ''
      }
    },
    toggleTheme () {
      if (this.dark) {
        this.setLight()
      } else {
        this.setDark()
      }
    },
    themeOnCreated () {
      if (process.client) {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('kelleher_theme='))
        const cookieValue = (cookie) ? cookie.split('=')[1] : ''
        this.dark = cookieValue === 'dark'

        if (this.dark) {
          this.setDark()
        }
      }
    }
  }
}
</script>

<style scoped>
.default-layout {
    margin-top: 40px;
    margin-bottom: 60px;
}
</style>
