/** @jsx jsx */
import {
  jsx,
  Box,
  IntrinsicImage,
  Link,
  Text,
  SxStyleProp,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {FluidObject} from 'gatsby-image';

export interface CrossLinkProps {
  title: string;
  fluid: FluidObject;
  alt: string;
  caption: string;
  link: {
    url: string;
    label: string;
  };
  sx?: SxStyleProp;
  className?: string;
}

export const CrossLink = ({
  title,
  fluid,
  alt,
  caption,
  link,
  sx,
  className,
}: CrossLinkProps): JSX.Element => {
  return (
    <Box
      sx={{
        position: 'relative',
        my: [4, null, 5],
        ml: [0, null, 6],
        mr: [0, null, 3],
        width: '100%',
      }}
    >
      <H
        className={className}
        sx={{
          variant: 'styles.h1',
          fontSize: [6, 7],
          writingMode: ['initial', null, 'vertical-lr'],
          transform: ['none', null, 'rotate(180deg)'],
          transformOrigin: 'left',
          display: 'inline-block',
          position: ['unset', null, 'absolute'],
          top: -5,
          left: [0, null, -3],
          mb: [2, null, 0],
          ...sx,
        }}
      >
        {title}
      </H>
      <Box sx={{maxWidth: ['unset', null, 320, 425]}}>
        <IntrinsicImage fluid={fluid} alt={alt} ratio={425 / 270} />
        <Text mt={3} mb={4}>
          {caption}
        </Text>
        <Link href={link.url} variant={'underline'}>
          {link.label}
        </Link>
      </Box>
    </Box>
  );
};
