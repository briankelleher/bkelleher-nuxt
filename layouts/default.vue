<template>
  <div :class="layoutClasses">
    <TopBar />
    <Nuxt />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data: () => {
    return {}
  },
  computed: {
    ...mapGetters({
      dark: 'settings/dark'
    }),
    layoutClasses () {
      let c = 'default-layout'
      if (this.dark) {
        c += ' dark'
      }
      return c
    }
  },
  mounted () {
    this.themeOnCreated()
  },
  methods: {
    ...mapActions({
      themeOnCreated: 'settings/themeOnCreated'
    })
  }
}
</script>

<style scoped>
.default-layout {
    margin-top: 40px;
    margin-bottom: 60px;
}
</style>
