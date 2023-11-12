<template>
  <div>
    <label v-for="item in items" :key="item.id">
      <input type="checkbox" v-model="item.isVisible"> {{ item.name }}
    </label>
    
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const items = ref([
  { id: 1, name: 'Apple', isVisible: true },
  { id: 2, name: 'Banana', isVisible: false },
  { id: 3, name: 'Orange', isVisible: true },
  // ... other items
]);

const filteredItems = computed(() => {
  return items.value.filter(item => item.isVisible);
});
</script>