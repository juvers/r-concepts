/** @jsx jsx */
import {jsx} from '@tishman/components';
import {forwardRef} from 'react';
import Img from 'gatsby-image';
import {IntrinsicBox, IntrinsicBoxProps} from '~IntrinsicBox';

import type {GatsbyImageProps} from 'gatsby-image';
import type {ComponentProps} from 'react';

export type IntrinsicImageProps = IntrinsicBoxProps & GatsbyImageProps;

const extractGatsbyImageProps = (
  props: IntrinsicImageProps,
): [GatsbyImageProps, IntrinsicBoxProps] => {
  const {
    resolutions,
    sizes,
    fixed,
    fluid,
    fadeIn,
    durationFadeIn,
    title,
    alt,
    critical,
    crossOrigin,
    style,
    imgStyle,
    placeholderStyle,
    placeholderClassName,
    backgroundColor,
    onLoad,
    onError,
    onStartLoad,
    Tag,
    itemProp,
    loading,
    draggable,
    ...boxProps
  } = props;
  return [
    {
      resolutions,
      sizes,
      fixed,
      fluid,
      fadeIn,
      durationFadeIn,
      title,
      alt,
      critical,
      crossOrigin,
      style,
      imgStyle,
      placeholderStyle,
      placeholderClassName,
      backgroundColor,
      onLoad,
      onError,
      onStartLoad,
      Tag,
      itemProp,
      loading,
      draggable,
    },
    boxProps,
  ];
};

/**
 * Use the `IntrinsicImage` component like `GatsbyImage`, but
 * with a `ratio` prop like ThemeUI `AspectRatio`.
 *
 * @example
 *   <IntrinsicImage
 *     ratio={278 / 178}
 *     fluid={data.image.childImageSharp.fluid}
 *   />
 *
 * @see https://tishman.netlify.app/components/intrinsic-image
 * @see https://www.gatsbyjs.org/docs/gatsby-image/
 * @see https://tishman.netlify.app/components/intrinsic-box
 */
export const IntrinsicImage = forwardRef(function IntrinsicImage(
  props: IntrinsicImageProps,
  ref: ComponentProps<typeof IntrinsicBox>['ref'],
) {
  const [imageProps, {...boxProps}] = extractGatsbyImageProps(props);
  return (
    <IntrinsicBox
      className={props.className}
      {...boxProps}
      sx={{position: 'relative'}}
      ref={ref}
    >
      <Img
        {...imageProps}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      />
    </IntrinsicBox>
  );
});
