<template>
  <div class="page-slug contain">
    <nuxt-content :document="doc" />
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
export default {
  async asyncData ({ $content, params } : Context) {
    const doc = await $content(params.slug).fetch()

    return { doc }
  }
}
</script>
