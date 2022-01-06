<template>
    <figure class="article-image">
        <img
            :src="require(`~/assets/img/${this.src}`)"
            :alt="alt"
            :style="imageStyle"
        />
        <figcaption>{{ caption }}</figcaption>
    </figure>
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
        },
        maxWidth: {
            type: String,
            default: '100%'
        }
    },
    computed: {
        imageStyle() {
            let style = ''
            if ( this.maxWidth ) {
                style += `max-width:${this.maxWidth}`
            }
            return style
        }
    }
}
</script>

<style scoped>
.article-image {
    margin-top: 12px;
    margin-bottom: 12px;
}

.article-image img {
    margin: 0 auto;
    display: block;
}

.article-image figcaption {
    text-align: center;
    margin-top: 12px;
}
</style>