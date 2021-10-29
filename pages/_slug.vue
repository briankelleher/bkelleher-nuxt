<template>
    <div class="page-slug">
        <TopBar />
        <nuxt-content :document="doc"></nuxt-content>
    </div>
</template>

<script lang="ts">
export default {
    async asyncData({ $content, params }) {
        const doc = await $content(params.slug || 'hello').fetch()

        return { doc }
    }
}
</script>
