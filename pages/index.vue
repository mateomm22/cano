<template>
<header>
  <h1>
    Cano Jewelry
  </h1>
  <p>
    Duplicar productos
  </p>
</header>
  <main>
    <div class="search">
      <p>
        Inserte el ID del producto en la tienda original
      </p>
      <input type="text" name="id" id="id" v-model="prodId">
      <button @click="getProd">
        Buscar Producto
      </button>
    </div>

    <div v-if="prodData.data.title" class="results">

      <div class="product-data">
        <h2>
          {{ prodData.data.title }}
        </h2>
        <div class="image">
          <strong>
            Imagen:
          </strong>
          <img :src="prodData.data.featuredImage.url" alt="">
        </div>
        <p class="price">
          <strong>
            Precio:
          </strong>
          {{ prodData.data.priceRangeV2.minVariantPrice.currencyCode }}
          {{ prodData.data.priceRangeV2.minVariantPrice.amount }}
        </p>
        <p class="link">
          <strong>
            Preview:
          </strong>
          <a :href="prodData.data.onlineStorePreviewUrl" target="_blank">
            {{ prodData.data.onlineStorePreviewUrl }}
          </a>
        </p>
      </div>

      <template v-if="productNew">
        <p>
          El producto <strong>{{prodData.data.title}}</strong> no existe en la tienda internacional
        </p>
        <button
          @click="createProd">
          <strong>Crear Producto:</strong> {{prodData.data.title}}
        </button>
      </template>


      <template v-else>
        <p>
          El producto <strong>{{prodData.data.title}}</strong> ya existe
        </p>
        <button
          @click="addMedia(createRes.data.id)">
          <strong>Actualizar Producto:</strong> {{prodData.data.title}}
        </button>
      </template>

      <br>

      <div  v-if="isLoading" class="status">
        {{ status }}
      </div>

      <a
        v-if="isDone"
        class="see-product"
        :href="createRes.data.onlineStorePreviewUrl"
        target="_blank">
        Ver Producto
      </a>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue';

const productNew = ref(true);
const isLoading = ref(false);
const isDone = ref(false);
const status = ref('Loading...');

const prodId = ref('');
const prodData = reactive({data: {}});
const createRes = reactive({data: {}});

async function getProdNew(handle) {
  return $fetch('/api/getProductNew', {
    params: {
      handle
    }
  });
}

async function getProd() {
  productNew.value = true;

  const { data }  = await $fetch('/api/getProduct', {
    params: {
      id: prodId.value
    }
  });

  prodData.data = data.product;

  const {data: exists} = await getProdNew(prodData.data.handle);

  if(exists.productByHandle) {
    productNew.value = false;
  }

}


function addMedia(prodId) {
  status.value = 'Adding media...';

  return $fetch('/api/addMedia', {
    method: 'post',
    body: {
      prod: prodData.data,
      created: prodId,
    }
  });
}

async function createProd() {
  isDone.value = false;
  status.value = 'Creating Product...';

  const { data }  = await $fetch('/api/createProduct', {
    method: 'post',
    body: {
      prod: prodData.data
    }
  });

  isLoading.value = true;
  createRes.data = data.productCreate.product;

  await addMedia(createRes.data.id);

  isLoading.value = false;
  isDone.value = true;
}
</script>

<style>
  @import url('~/assets/css/index.css');
</style>

