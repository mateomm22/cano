import {createAdminApiClient} from '@shopify/admin-api-client';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const client = createAdminApiClient({
    storeDomain: config.storeDomain2,
    apiVersion: '2024-01',
    accessToken: config.accessToken2,
  });

  const { prod } = await readBody(event);

  // Create Prod
  const postOperation = `
  mutation productCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        title
        handle
        onlineStorePreviewUrl
      }
      shop {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
  `;

  const {data, errors, extensions} = await client.request(postOperation, {
    variables: {
      input: {
        title: prod.title,
        descriptionHtml: `<p>${prod.description}</p>`
      }
    },
  });


  return { data, errors };
})