<template>
    <div class="toggle-dark-btn-contain">
        <span>Dark Mode</span>
        <label class="switch">
            <input type="checkbox" v-model="darkValue" />
            <span class="slider round"></span>
        </label>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
    computed: {
        darkValue: {
            get() {
                return this.dark
            },
            set(val) {
                this.toggleDark(null)
            }
        },
        ...mapGetters({
            dark: 'settings/dark'
        })
    },
    methods: {
        ...mapMutations({
            toggleDark: 'settings/toggleDark'
        })
    }
}
</script>

<style lang="scss" scoped>
.toggle-dark-btn-contain {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    column-gap: 12px;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: darken(#15202b, 10%);
}

input:focus + .slider {
  box-shadow: 0 0 1px darken(#15202b, 10%);
}

input:checked + .slider:before {
  -webkit-transform: translateX(23px);
  -ms-transform: translateX(23px);
  transform: translateX(23px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>