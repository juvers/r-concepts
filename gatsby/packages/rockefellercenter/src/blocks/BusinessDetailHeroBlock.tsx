/** @jsx jsx */
import {
  Text,
  jsx,
  Button,
  Section,
  Box,
  Link,
  HoursAndAddress,
  ArrowLink,
  Grid,
  SidewaysArrowSVG,
  OpenTableIcon,
  ResyLogo,
  Flex,
  IntrinsicImage,
  IntrinsicBox,
  SanityRichText,
} from '@tishman/components';
import invariant from 'invariant';
import {H} from '@hzdg/sectioning';
import {
  getSanityFluidImageProps,
  getHoursProps,
  getContactsInfoProps,
  getLocationProps,
} from '~blocks/utils';
import {useState} from 'react';

import type {Block} from '@sanity/block-content-to-react';

const categorySlug = (category: string): string => {
  if (category === 'shop') {
    return 'shops';
  } else if (category === 'amenity') {
    return 'amenities';
  } else if (category === 'dine') {
    return 'dine';
  } else {
    throw new Error(`unknown category ${category}`);
  }
};

const CategoryIcon = (reservationUrl: string): JSX.Element => {
  if (reservationUrl.includes('opentable.com')) {
    return <OpenTableIcon />;
  } else if (reservationUrl.includes('resy.com')) {
    return <ResyLogo />;
  } else {
    throw new Error(`Unknown reservation URL ${reservationUrl}`);
  }
};

const categoryLabel = (category: string): string => {
  if (category === 'shop') {
    return 'Shops';
  } else if (category === 'amenity') {
    return 'Amenities & Services';
  } else if (category === 'dine') {
    return 'Dine';
  } else {
    throw new Error(`unknown category ${category}`);
  }
};

const BusinessDetailHeroBlock = ({
  data: {business},
}: {
  data: GatsbyTypes.sanityBusinessQuery;
}): JSX.Element | null => {
  const [isVisible, toggleVisible] = useState<boolean>(false);

  invariant(business, 'Business data is required!');

  const {category} = business.category;

  return (
    <Section p={[3, 5, 6]} sx={{maxWidth: '1265px', margin: 'auto'}}>
      <Grid columns={[1, null, 2]} gap={[2, 8]}>
        <Box sx={{margin: 'auto 0'}}>
          <ArrowLink
            reverse
            href={`/${categorySlug(category)}`}
            label={`Back to ${categoryLabel(category)}`}
          />
          <Box>
            <H
              sx={{
                fontWeight: 500,
                fontSize: '18px',
                textTransform: 'capitalize',
                mt: 4,
              }}
            >
              {category}
            </H>
            <H
              sx={{
                variant: 'styles.h1',
                my: 3,
                fontFamily: 'headingSecondary',
              }}
            >
              {business.titleAndSlug.title}
            </H>
          </Box>

          <Grid columns={[1, 2]} gap={4} sx={{py: 2}}>
            {
              <HoursAndAddress
                addressHeading="Contact & Directions"
                location={getLocationProps(business.location)}
                contactsInfo={business.contactsInfo.map((info) =>
                  getContactsInfoProps(info),
                )}
              />
            }
            {business.hours && (
              <HoursAndAddress
                hoursHeading="Hours"
                hours={getHoursProps(business)}
              />
            )}
          </Grid>
          <Box>
            <Button
              sx={{
                mb: [3, null],
                display: ['block', 'none'],
              }}
              variant="text"
              onClick={() => toggleVisible(!isVisible)}
            >
              {isVisible ? 'Hide Full Details -' : 'See Full Details +'}
            </Button>
            <Link
              sx={{
                mb: 4,
                display: [isVisible ? 'inline-block' : 'none', 'inline-block'],
              }}
              variant="underline"
              href={`https://www.google.com/maps/search/?api=1&query= ${business.titleAndSlug.title} ${business.location.address1}`}
            >
              VIEW ON MAP
            </Link>
            <Box
              sx={{
                width: ['100%', 'unset'],
                mb: [4, null, null, 0],
                display: [isVisible ? 'block' : 'none', 'block'],
              }}
            >
              {business.orderNow?.url && (
                <Link
                  sx={{
                    mt: 2,
                    mb: 4,
                    display: 'block',
                  }}
                  href={business.orderNow.url}
                >
                  <Button px={4} py={3} variant="inverted">
                    <Flex>
                      <Box mr={2}>{business.orderNow.caption}</Box>
                      <SidewaysArrowSVG
                        aria-hidden
                        sx={{alignSelf: 'center'}}
                      />
                    </Flex>
                  </Button>
                </Link>
              )}
            </Box>
            <Box
              sx={{
                width: ['100%', 'unset'],
                mb: [4, null, null, 0],
                display: [isVisible ? 'block' : 'none', 'block'],
              }}
            >
              {business.reservation?.url && (
                <Link
                  sx={{
                    mt: 2,
                    mb: 4,
                    display: 'block',
                  }}
                  href={business.reservation.url}
                >
                  <Button px={4} py={3} variant="inverted">
                    <Flex sx={{alignItems: 'center'}}>
                      <Box mr={2}>{business.reservation.type}</Box>
                      {CategoryIcon(business.reservation.url)}
                    </Flex>
                  </Button>
                </Link>
              )}
            </Box>
            <Text
              sx={{
                variant: 'smallP',
                mb: 4,
                display: [isVisible ? 'block' : 'none', 'block'],
              }}
            >
              {business._rawBody && (
                <SanityRichText
                  blocks={(business._rawBody as unknown) as Block[]}
                />
              )}
            </Text>
            {business.website?.url && business.website.caption && (
              <Link
                variant="underline"
                href={business.website.url}
                sx={{
                  mb: 4,
                  display: [
                    isVisible ? 'inline-block' : 'none',
                    'inline-block',
                  ],
                }}
              >
                <Flex>
                  <Text mr={2}>{business.website.caption}</Text>
                  <SidewaysArrowSVG aria-hidden sx={{alignSelf: 'center'}} />
                </Flex>
              </Link>
            )}
          </Box>
        </Box>
        <IntrinsicBox>
          <IntrinsicImage
            ratio={[16 / 20, null, 13 / 20]}
            {...getSanityFluidImageProps(business.poster)}
          />
        </IntrinsicBox>
      </Grid>
    </Section>
  );
};

export default BusinessDetailHeroBlock;
