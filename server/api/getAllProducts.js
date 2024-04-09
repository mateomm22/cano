import {createAdminApiClient} from '@shopify/admin-api-client';


export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const client = createAdminApiClient({
    storeDomain: config.storeDomain2,
    apiVersion: '2024-01',
    accessToken: config.accessToken2,
  });

  const shopQuery = `
  query products {
    products(first: 250, sortKey: TITLE, reverse: true) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
  `;

  const translationsQuery = (prodId) => `
  query {
    translatableResource(resourceId: "${prodId}") {
      resourceId
      translatableContent {
        key
        value
        digest
        locale
      }
    }
  }
  `;

  const response = await client.fetch(shopQuery);
  const translations = [];

  if (response.ok) {
    const {errors, data, extensions} = await response.json();

    const {products: {edges}} = data;

    for (let index = 0; index < edges.length; index++) {
      const prodId = edges[index].id;
      const responseTranslations = await client.fetch(translationsQuery(prodId));

      if (responseTranslations.ok) {
        const {errors, data: dataTrans, extensions} = await responseTranslations.json();
        translations.push(dataTrans);
        // console.log(dataTrans);
      }

    }


    return { translations };
  }
})