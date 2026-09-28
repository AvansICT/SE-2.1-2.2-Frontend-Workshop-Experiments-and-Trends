<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface TickPayload {
  time: string
}

const time = ref('--:--:--')
const connected = ref(false)
let eventSource: EventSource | undefined

onMounted(() => {
  eventSource = new EventSource('/events')

  eventSource.onopen = () => {
    connected.value = true
  }

  eventSource.onmessage = (event: MessageEvent<string>) => {
    const data = JSON.parse(event.data) as TickPayload
    time.value = new Date(data.time).toLocaleTimeString('nl-NL')
  }

  eventSource.onerror = () => {
    connected.value = false
  }
})

onUnmounted(() => {
  eventSource?.close()
})
</script>

<template>
  <div class="clock">{{ time }}</div>
  <div class="status" :class="{ connected }">
    {{ connected ? 'Verbonden via SSE' : 'Niet verbonden' }}
  </div>
</template>

<style scoped>
.clock {
  font-size: 3rem;
  font-variant-numeric: tabular-nums;
}
.status {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #888;
}
.status.connected {
  color: #4ade80;
}
</style>
