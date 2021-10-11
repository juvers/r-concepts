import {
  getSanityFluidImageProps,
  getSanityVideoProps,
  SanityImageType,
  FluidImageProps,
  SanityVideoType,
  SanityVideoProps,
} from '~blocks/utils';

/**
 * Get Sanity Gallery Item Props
 *
 * Since sanity allows for images and videos to be added to the hero gallery
 * we need to be able to validate if its a image or video and also pass the
 * correct data back. This function uses sanity's typename variable to return
 * either a FluidImageProps or SanityVideoProps
 */

export const getSanityGalleryItemProps = (
  item?: {__typename: 'SanityImageType' | 'SanityAmbientVideoType'} & (
    | SanityImageType
    | SanityVideoType
  ),
): FluidImageProps | SanityVideoProps => {
  if (!item) throw new Error('Gallery item missing');
  if (!item.__typename) throw new Error('Gallery item typename missing');
  return item.__typename === 'SanityImageType'
    ? getSanityFluidImageProps(item as SanityImageType)
    : getSanityVideoProps(item as SanityVideoType);
};
