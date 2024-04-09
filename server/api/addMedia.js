import {createAdminApiClient} from '@shopify/admin-api-client';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const client = createAdminApiClient({
    storeDomain: config.storeDomain2,
    apiVersion: '2024-01',
    accessToken: config.accessToken2,
  });

  const { prod, created } = await readBody(event);
    // Create Prod
    const postOperation = `
    mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
      productCreateMedia(media: $media, productId: $productId) {
        media {
          id
          preview {
            image {
              url
            }
          }
        }
        product {
          id
          title
          handle
          onlineStorePreviewUrl
        }
        mediaUserErrors {
          code
          field
          message
        }
      }
    }
    `;

    const {data, errors, extensions} = await client.request(postOperation, {
      variables: {
        media: [
          {
            alt: prod.title,
            mediaContentType: "IMAGE",
            originalSource: prod.featuredImage.url
          }
        ],
        productId: created
      },
    });


  return { data, errors };
})