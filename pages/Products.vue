<template>
  <div>
    <button @click="getProds">
      Get products
    </button>

    <!-- <pre v-if="translations">
      {{ translations }}
    </pre> -->
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const productNew = ref(true);
const isLoading = ref(false);
const isDone = ref(false);
const status = ref('Loading...');

const prodId = ref('8879013036347');
const prodData = reactive({data: {}});
const createRes = reactive({data: {}});

async function getProds() {
  const res  = await $fetch('/api/getAllProducts');

  console.log(res);

  // prodData.data = data;


}
</script>