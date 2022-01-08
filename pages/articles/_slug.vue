<template>
  <div class="article-slug contain">
    <h2>{{ doc.title }}</h2>
    <p class="article-meta">
      Last Updated: {{ doc.updatedAt | formatDate }}
    </p>
    <nuxt-content :document="doc" />
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'

export default {
  async asyncData ({ $content, params } : Context) {
    const doc = await $content('articles', params.slug).fetch()

    return { doc }
  }
}
</script>

<style lang="scss">
.article-slug {
    margin-top: 30px;
    h2 {
        font-size: 60px;
        // border-bottom: 2px solid #2972b1;
        margin-bottom: 4px;
    }
    .article-meta {
        font-family: "Archivo Narrow", sans-serif;
        margin-bottom: 60px;
        font-size: 18px;
        color: #c1c5cb;
    }
    .nuxt-content {
        line-height: 1.8;
        font-size: 20px;
        margin-bottom: 60px;
        & > * {
            margin: 0;
            margin-bottom: 32px;
        }
        * + h2,
        * + h3,
        * + h4,
        * + h5,
        * + h6 {
            margin-top: 88px;
        }
        pre {
            overflow-x: visible;
            font-family: monospace;
            code {
                font-family: monospace;
                span {
                    font-family: monospace;
                }
            }
        }
        .nuxt-content-highlight {
            background-color: rgba(38,38,38,0.54);
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            span.filename {
                font-family: monospace;
                font-size: 14px;
                margin-left: 20px;
            }
        }
    }
}
</style>
