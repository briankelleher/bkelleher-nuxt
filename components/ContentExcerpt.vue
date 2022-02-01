<template>
  <div class="content-excerpt">
    <NuxtLink :to="contentLink">
      <h3>{{ content.title }}</h3>
    </NuxtLink>
    <p class="article-meta">
      Last Updated: {{ content.updatedAt | formatDate }}
    </p>
    <p>{{ content.description }}</p>
    <NuxtLink :to="contentLink" class="content-excerpt-link">
      Read More
    </NuxtLink>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'

interface BKContent {
  slug: string,
  title: string,
  updatedAt: Date,
  description: string
}

const ContentExcerpt = Vue.extend({
  props: {
    content: {
      required: true,
      type: Object as PropType<BKContent>
    }
  },
  computed: {
    contentLink () : string {
      return `/articles/${this.content.slug}`
    }
  }
})

export default ContentExcerpt
</script>

<style lang="scss">
.content-excerpt {
    h3 {
        margin-bottom: 18px;
    }
    p {
        line-height: 1.6;
    }
    .content-excerpt-link {
        margin-top: 10px;
    }
    .article-meta {
        font-family: "Archivo Narrow", sans-serif;
        font-size: 18px;
        color: #525252;
    }
}

.dark {
    .content-excerpt {
        .article-meta {
            color: #c1c5cb;
        }
    }
}
</style>
