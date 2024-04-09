import {createAdminApiClient} from '@shopify/admin-api-client';


export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const client = createAdminApiClient({
    storeDomain: config.storeDomain1,
    apiVersion: '2024-01',
    accessToken: config.accessToken1,
  });

  const { id } = await getQuery(event);

  const getOperation = `
    query ProductQuery($id: ID!) {
      product(id: $id) {
        id
        title
        handle
        onlineStorePreviewUrl
        featuredImage {
          url
        }
        description
        translations(locale: "en") {
          key
          locale
          value
        }
        priceRangeV2 {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        seo {
          title
          description
        }
      }
    }
  `;

  const { data, errors, extensions } = await client.request(getOperation, {
    variables: {
      id: `gid://shopify/Product/${id}`,
    },
  });

  return { data, errors };
})