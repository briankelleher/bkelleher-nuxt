<template>
  <div class="page-index contain">
    <h2>Articles</h2>
    
    <div class="articles-excerpts">
      <content-excerpt
        v-for="article in articles"
        :key="`ae-${article.slug}`"
        :content="article" />
    </div>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import ContentExcerpt from '@/components/ContentExcerpt.vue'
export default {
    components: { ContentExcerpt },
  async asyncData ({ $content } : Context) {
    const articles = await $content('articles').limit(5).fetch()

    return { articles }
  }
}
</script>
