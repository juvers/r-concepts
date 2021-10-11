/** @jsx jsx */
import {
  jsx,
  Text,
  Box,
  IntrinsicImage,
  Link,
  SanityRichText,
  SxStyleProp,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {Fragment} from 'react';

import type {Ticket} from '../types';

const BuyButton = ({
  url,
  price,
  className,
  sx,
}: {
  url: string;
  price: string;
  sx?: SxStyleProp;
  className?: string;
}) => (
  <Link
    className={className}
    href={url}
    variant="button"
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      p: 3,
      mt: 3,
      mb: '0px',
      ...sx,
    }}
  >
    <Text as="span" variant="smallP" mx={2} color="inherit">
      Buy Tickets
    </Text>
    <Text as="span" variant="ticketPriceSmall" mx={2}>
      {price}
    </Text>
  </Link>
);

export function CardDetail({
  image: {
    asset: {fluid},
  },
  title,
  description,
  price,
  alt,
  url: {url},
  buttonPosition = 'bottom',
}: Ticket & {buttonPosition?: 'bottom' | 'aboveDescription'}): JSX.Element {
  return (
    <Fragment>
      <Box
        sx={{
          flex: '2 2 auto',
        }}
      >
        <IntrinsicImage
          ratio={[238 / 160, 316 / 212]}
          fluid={fluid}
          alt={alt}
        />
        <H
          sx={{
            variant: 'styles.h2',
            mt: [3],
            fontFamily: 'headingSecondary',
            fontSize: [4, 6],
            fontWeight: ['book', 'heading'],
          }}
        >
          {title}
        </H>
        {buttonPosition === 'aboveDescription' && (
          <BuyButton url={url} price={price} />
        )}
        {description && (
          <Text variant="smallP" mt={3} sx={{'p:last-child': {mb: '0px'}}}>
            <SanityRichText blocks={description} />
          </Text>
        )}
      </Box>

      {buttonPosition === 'bottom' && <BuyButton url={url} price={price} />}
    </Fragment>
  );
}
