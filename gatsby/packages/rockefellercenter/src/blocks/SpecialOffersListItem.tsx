/** @jsx jsx */
import {
  jsx,
  Flex,
  Box,
  Text,
  Spacer,
  Grid,
  SanityRichText,
  Link,
  IntrinsicBox,
  IntrinsicImage,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {FluidObject} from 'gatsby-image';
import type {Block} from '@sanity/block-content-to-react';
import {
  getSanityFluidImageProps,
  getRetailerHoursProps,
  getContactsInfoProps,
  getLocationProps,
} from '~blocks/utils';
import {SpecialOffersHoursAndAddress} from '~components/SpecialOffersHoursAndAddress';

export interface FluidImageProps {
  fluid?: FluidObject;
  alt?: string;
}

export interface LocationProps {
  title: string;
  address1: string;
  address2: string;
}

export interface HoursProps {
  day?: string;
  opensAt?: string;
  closesAt?: string;
}

export interface ContactInfoProps {
  type: string;
  value: string | '';
}

export interface RetailerProps {
  retailerTitle?: string;
  retailerSlug?: string;
  retailerPoster?: FluidImageProps;
  retailerHours?: HoursProps[];
  retailerContactInfo?: ContactInfoProps[];
  retailerLocation?: LocationProps;
  retailerMapId?: string;
  retailerCategory?: string;
}

export interface SpecialOffersListItemProps {
  title?: string;
  slug?: string;
  offerImage?: FluidImageProps;
  startDateTime?: string;
  endDateTime?: string;
  offerLocation?: LocationProps;
  description: Block[];
  note?: string;
  url: string;
  caption?: string;
  retailers?: RetailerProps[];
}

const SpecialOffersListItem = ({
  title,
  // slug,
  offerImage,
  startDateTime,
  endDateTime,
  offerLocation,
  description,
  note,
  url,
  caption,
  retailers,
}: SpecialOffersListItemProps): JSX.Element => {
  const firstRetailer = retailers && retailers[0];

  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        alignItems: ['flex-start'],
        flexDirection: ['column', 'column', 'row'],
        py: [27, 5, 5],
        px: [0, 0, 5],
        borderTop: '1px solid #979797',
        maxWidth: 1070,
        margin: '0 auto ',
      }}
    >
      <Box sx={{flexBasis: '50%', pt: [0, 19]}}>
        <H
          sx={{
            variant: 'styles.h2',
            pb: [28, 18],
            fontFamily: 'headingSecondary',
            fontSize: [24, 30],
          }}
        >
          {title}
        </H>

        <Text
          variant="eyebrow"
          sx={{
            mt: 0,
            mb: 3,
            display: 'flex',
            flexWrap: 'wrap',
            fontWeight: 'medium',
          }}
        >
          <Spacer>
            {startDateTime}—{endDateTime}
          </Spacer>
          {retailers ? (
            retailers.length > 1 ? (
              <Spacer>{offerLocation?.title}</Spacer>
            ) : (
              <Spacer>{firstRetailer?.retailerTitle}</Spacer>
            )
          ) : null}
        </Text>

        <Text
          sx={{
            variant: 'smallP',
            mb: 24,
            display: ['block'],
          }}
        >
          {description && (
            <SanityRichText blocks={(description as unknown) as Block[]} />
          )}
        </Text>

        <Box sx={{pb: [17, 45]}}>
          {retailers && retailers.length === 1 ? (
            <Grid columns={[1, 1, 2]} gap={[1, 4]} sx={{py: 2}}>
              <SpecialOffersHoursAndAddress
                addressHeading="Contact & Directions"
                location={getLocationProps(firstRetailer?.retailerLocation)}
                contactsInfo={firstRetailer?.retailerContactInfo?.map((info) =>
                  getContactsInfoProps(info),
                )}
              />

              <SpecialOffersHoursAndAddress
                hoursHeading="Hours"
                hours={getRetailerHoursProps({
                  // hourText: 'Hours',
                  hours: retailers && firstRetailer?.retailerHours,
                })}
              />
            </Grid>
          ) : (
            <Box>
              <Text sx={{fontWeight: 500}}>
                Participating retailers include:
              </Text>
              <Grid
                columns={[1, 1, 2]}
                sx={{py: 2, columnGap: [1, 4], rowGap: [0, 1]}}
              >
                {retailers &&
                  retailers.map((retailer, index) => {
                    return (
                      <Link
                        href={
                          retailer?.retailerCategory === 'shop'
                            ? `/shops/${retailer?.retailerSlug}`
                            : retailer?.retailerCategory === 'dine'
                            ? `/dine/${retailer?.retailerSlug}`
                            : `/amenities/${retailer?.retailerSlug}`
                        }
                        key={index}
                        variant="menu"
                        sx={{fontSize: 16, maxWidth: 'max-content'}}
                      >
                        <Text>{retailer.retailerTitle}</Text>
                      </Link>
                    );
                  })}
              </Grid>
            </Box>
          )}
        </Box>

        <Box>
          {note && (
            <Text
              sx={{
                width: ['100%', 360],
                variant: 'smallP',
                mb: 4,
                display: ['block'],
              }}
            >
              *{note}
            </Text>
          )}

          {url && (
            <Link
              sx={{
                mb: 4,
                display: ['inline-block'],
              }}
              variant="underline"
              href={`${url}`}
            >
              {caption ? caption : 'LEARN MORE'}
            </Link>
          )}
        </Box>
      </Box>
      <IntrinsicBox>
        <IntrinsicImage
          sx={{width: '100%', flexShrink: 0}}
          minWidth={[290, 380]}
          ratio={190 / 270}
          {...getSanityFluidImageProps(
            offerImage
              ? offerImage
              : retailers && firstRetailer?.retailerPoster,
          )}
        />
      </IntrinsicBox>
    </Flex>
  );
};

export default SpecialOffersListItem;
