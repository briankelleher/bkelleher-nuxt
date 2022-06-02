export const state = () => ({
    dark: false
})

export const getters = {
    dark(state) {
        return state.dark
    }
}

export const mutations = {
    toggleDark(state, val) {
        if ( val !== null ) {
            state.dark = !!val
        } else {
            state.dark = !state.dark
        }
        
        if ( process.client ) {
            document.cookie = `kelleher_theme=${state.dark ? 'dark' : ''}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;`
            document.documentElement.className = state.dark ? 'dark' : ''
        }
    },
    
}

export const actions = {
    themeOnCreated({ commit }) {
        if (process.client) {
            const cookie = document.cookie.split('; ').find(row => row.startsWith('kelleher_theme='))
            const cookieValue = (cookie) ? cookie.split('=')[1] : ''
            if (cookieValue === 'dark') {
                console.log('isdark')
              commit('toggleDark', true)
            }
        }
    }
}