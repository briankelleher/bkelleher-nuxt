<template>
  <div class="content-excerpt">
    <h3>{{ content.title }}</h3>
    <p class="article-meta">
      Last Updated: {{ content.updatedAt | formatDate }}
    </p>
    <p>{{ content.description }}</p>
    <NuxtLink :to="`/articles/${content.slug}`" class="content-excerpt-link">
      Read More
    </NuxtLink>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    content: {
      required: true,
      type: Object
    }
  }
}
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
        color: #c1c5cb;
    }
}
</style>
