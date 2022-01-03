<template>
    <img :src="require(`~/assets/img/${this.src}`)" :alt="alt">
</template>

<script>
export default {
    props: {
        src: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            required: true
        },
        caption: {
            type: String,
            default: ""
        }
    }
}
</script>