<template>
  <header>
    <div class="left-side">
      <img src="/images/logo.svg" height="40" alt="Beefree SDK" />
    </div>
    <div class="right-side">
      <img src="/images/vue-wordmark-white.svg" alt="Vue.js" />
      <img src="/images/fastify-white.svg" alt="Fastify" class="fastify-logo" />
    </div>
  </header>
</template>

<script setup lang="ts">
</script>

<style scoped>
header {
  display: flex;
  height: 64px;
  flex-shrink: 0;
}
.left-side {
  display: flex;
  align-items: center;
  padding-left: 1rem;
  flex-shrink: 0;
}
.right-side {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
  padding-right: 1rem;
  gap: 20px;
  background: var(--white-to-vue-horizontal-gradient);
  height: 100%;
}
.right-side img {
  height: 28px;
  width: auto;
}
.fastify-logo {
    transform: translateY(0.095rem);
}

</style>
