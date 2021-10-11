import {FluidObject} from 'gatsby-image';

export type SanityImageType = Partial<
  Omit<GatsbyTypes.SanityImageType, 'asset'>
> & {
  asset?: {
    fluid?: GatsbyTypes.GatsbySanityImageFluidFragment;
  };
};

export interface FluidImageProps {
  fluid: FluidObject;
  alt: string;
  caption?: string;
}

export const getSanityFluidImageProps = (
  image?: SanityImageType,
): FluidImageProps => {
  if (!image?.alt) throw new Error('Expected sanity image to have alt text');
  if (!image?.asset?.fluid)
    throw new Error('Expected valid sanity fluid image asset');
  const {fluid} = image.asset;
  if (!fluid.aspectRatio)
    throw new Error('Expected valid sanity fluid image aspect ratio');
  if (!fluid.sizes) throw new Error('Expected valid sanity fluid image sizes');
  if (!fluid.src) throw new Error('Expected valid sanity fluid image src');
  if (!fluid.srcWebp)
    throw new Error('Expected valid sanity fluid image srcWebp');
  if (!fluid.srcSet)
    throw new Error('Expected valid sanity fluid image srcSet');
  if (!fluid.srcSetWebp)
    throw new Error('Expected valid fluid image srcSetWebp');
  return {
    caption: image?.caption,
    alt: image.alt,
    fluid: {
      aspectRatio: fluid.aspectRatio,
      base64: fluid.base64,
      sizes: fluid.sizes,
      src: fluid.src,
      srcSet: fluid.srcSet,
      srcSetWebp: fluid.srcSetWebp,
      srcWebp: fluid.srcWebp,
    },
  };
};
