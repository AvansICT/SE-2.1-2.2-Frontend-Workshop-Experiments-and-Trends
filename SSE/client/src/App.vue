<script setup lang="ts">
import LiveClock from './components/LiveClock.vue'
</script>

<template>
  <main>
    <LiveClock />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
