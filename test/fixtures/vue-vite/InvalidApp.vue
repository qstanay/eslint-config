<script setup lang="ts">
console.log('debug');
const items = [1, 2];
const ready = true;
</script>

<template>
  <div v-for="item in items" v-if="ready"></div>
</template>
