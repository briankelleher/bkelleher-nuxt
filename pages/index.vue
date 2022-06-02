<template>
  <div class="page-index contain">
    <callout-paragraph>
      In the past, I've worked for the University of Connecticut building websites like <a href="https://today.uconn.edu/">UConn Today</a>, startups like <a href="https://magazine.uconn.edu/2018/09/25/graduating-c-e-o/">Loki Live Streaming</a>, and I currently work for the <a href="https://dxgroup.core.uconn.edu/">Digital Experience Group</a> at UConn.  I tend to write a lot of Vue.js, but I've written for all parts of the stack.
    </callout-paragraph>
    <div class="row">
      <div class="col">
        <callout-content>
        <p>Most recently, I've been working on:</p>
        <ul>
          <li><a href="https://access2ag.com">Access2Ag</a>, connecting bus routes with locally grown food sources</li>
          <li><a href="https://sourceryapp.org">Sourcery</a>, a source for requesting and servicing archival documents</li>
        </ul>
        </callout-content>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <h2>Articles</h2>
        <div class="articles-excerpts">
          <content-excerpt
            v-for="article in articles"
            :key="`ae-${article.slug}`"
            :content="article"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import ContentExcerpt from '@/components/ContentExcerpt.vue'
import CalloutParagraph from '~/components/CalloutParagraph.vue'
export default {
  components: { ContentExcerpt, CalloutParagraph },
  async asyncData ({ $content } : Context) {
    const articles = await $content('articles').limit(5).fetch()

    return { articles }
  }
}
</script>
