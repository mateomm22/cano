import {createAdminApiClient} from '@shopify/admin-api-client';


export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const client = createAdminApiClient({
    storeDomain: config.storeDomain2,
    apiVersion: '2024-01',
    accessToken: config.accessToken2,
  });

  const { handle } = await getQuery(event);

  const getOperation = `
    query getProductIdFromHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
      }
    }
  `;

  const { data, errors, extensions } = await client.request(getOperation, {
    variables: {
      'handle': handle
    },
  });

  return { data, errors };
})