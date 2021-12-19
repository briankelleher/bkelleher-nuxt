<template>
  <div class="content-excerpt">
    <h3>{{ content.title }}</h3>
    <p>{{ content.description }}</p>
    <NuxtLink :to="`/articles/${content.slug}`">
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
        margin-bottom: 16px;
    }
}
</style>
