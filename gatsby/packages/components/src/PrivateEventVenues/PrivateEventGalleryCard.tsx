/** @jsx jsx */
import {jsx, Box, IntrinsicImage, SxStyleProp} from '@tishman/components';
import {FluidObject} from 'gatsby-image';
import {forwardRef, Ref} from 'react';

export interface PrivateEventGalleryCardProps {
  fluid?: FluidObject;
  caption?: string;
  alt?: string;
  /** Any overriding styles to change default styling */
  sx?: SxStyleProp;
  /** Some sx props get passed as classNames to components */
  className?: string;
  index: number;
  onClick: (index: number) => void;
  active?: boolean;
}

export const PrivateEventGalleryCard = forwardRef(
  function PrivateEventGalleryCard(
    {
      fluid,
      alt,
      sx,
      className,
      index,
      onClick,
      active = false,
    }: PrivateEventGalleryCardProps,
    ref: Ref<HTMLDivElement>,
  ): JSX.Element {
    return (
      <Box
        ref={ref}
        className={className}
        onClick={() => {
          onClick(index);
        }}
        sx={{
          overflow: 'hidden',
          width: 235,
          height: [133],
          p: 2,
          border: active ? '1px solid' : 'none',
          borderColor: active ? 'muted' : 'none',
          scrollSnapAlign: 'start',
          ...sx,
        }}
      >
        {fluid && (
          <IntrinsicImage
            ratio={[320 / 266, 1280 / 680]}
            fluid={fluid}
            alt={alt}
            sx={{
              height: '100%',
            }}
          />
        )}
      </Box>
    );
  },
);
