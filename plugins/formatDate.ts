import Vue from 'vue'

Vue.filter('formatDate', (val : string) => {
    const options : Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    return new Date(val).toLocaleDateString('en', options)
})