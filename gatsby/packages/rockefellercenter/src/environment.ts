/**
 * process.env are nullable fields which means there
 * is a chance they are not available. we rely on
 * having both sanity env's available in order to
 * use
 *
 * import {getFluidGatsbyImage} from 'gatsby-source-sanity';
 *
 * Sanity Rich text blocks do not actually pass the image directly
 * instead they pass a reference and you need to use the func
 * above to get the actual asset. This file:
 * A.) ensures the variable are available
 * B.) adds a new constant as to not needing to query the process.env directly
 */

export const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID ?? 'bs9rmafh';
export const SANITY_DATASET = process.env.SANITY_DATASET ?? 'production';
export const GOOGLE_API_KEY =
  process.env.GOOGLE_API_KEY ?? 'AIzaSyCcOrH-osDEtvaM9vedklp-91_fA3bXUXI';
export const GOOGLE_SEARCH_KEY =
  process.env.GOOGLE_SEARCH_KEY ?? '016857086406217865809:xteydcxhtxm';
