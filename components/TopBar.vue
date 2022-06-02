<template>
  <div class="top-bar contain">
    <header class="site-header">
      <NuxtLink to="/" class="header-link">
        <h1>Brian Kelleher</h1>
      </NuxtLink>
      <toggle-dark />
      <h1 class="header-description">
        Full-Stack Web Developer in Denver, CO
      </h1>
    </header>
    <nav class="top-bar-nav contain">
      <NuxtLink to="/articles">
        Articles
      </NuxtLink>
      <a href="https://twitter.com/b_kelleher">Twitter</a>
    </nav>
  </div>
</template>

<script>
export default {
  data: () => {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.top-bar {
  .site-header {
    padding-top: 10px;
    .header-link {
      text-decoration: none;
      color: black;
    }
    .header-description {
      color: #8a8a8a;
      font-family: sans-serif;
      font-weight: normal;
      font-size: 18px;
    }
  }

  .top-bar-nav {
    border-bottom: 1px solid $grey;
    list-style-type: none;
    padding: 0 0 24px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 16px;
    .navigation-link {
      color: blue;
    }
  }
}

.dark {
  .top-bar {
    .site-header {
      .header-link {
        color: white;
      }
    }
    .top-bar-nav {
      .navigation-link {
        color: white;
      }
    }
  }
}
</style>
