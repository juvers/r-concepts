/**@jsx jsx */
import {
  jsx,
  Section,
  Container,
  Box,
  Grid,
  Text,
  HoursAndAddress,
  SanityRichText,
  Link,
  IntrinsicBox,
  IntrinsicImage,
  Spacer,
  Button,
} from '@tishman/components';
import {
  getSanityFluidImageProps,
  getHoursProps,
  getContactsInfoProps,
  getLocationProps,
} from '~blocks/utils';
import {H} from '@hzdg/sectioning';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import type {Block} from '@sanity/block-content-to-react';
import IntroText from '~components/IntroText';

const SPECIAL_OFFERS_HERO_QUERY = graphql`
  query SpecialOffersHero {
    sanityOfferLp {
      FeaturedOfferTitle
      featuredOffer {
        seo {
          metaTitle
          metaDescription
        }
        titleAndSlug {
          title
          slug {
            current
          }
        }
        OfferImage {
          caption
          alt
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
        }
        retailers {
          titleAndSlug {
            slug {
              current
            }
            title
          }
          poster {
            alt
            caption
            asset {
              fluid {
                ...GatsbySanityImageFluid
              }
            }
          }
          hours {
            day
            opensAt
            closesAt
          }
          contactsInfo {
            type
            value
          }
          location {
            title
            address1
            address2
          }
          mapId
          category {
            category
          }
        }
        startEndDateTime {
          startDateTime(formatString: "MMM D")
          endDateTime(formatString: "MMM D")
        }
        OfferLocation {
          title
          address1
          address2
        }
        _rawDescription
        Note
        Learn_More_URL {
          caption
          url
        }
      }
    }
  }
`;

const SpecialOffersHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element | null => {
  const {sanityOfferLp} = useStaticQuery<GatsbyTypes.SpecialOffersHeroQuery>(
    SPECIAL_OFFERS_HERO_QUERY,
  );

  const featuredOffer = sanityOfferLp?.featuredOffer;
  const firstRetailer = featuredOffer?.retailers[0];

  const featuredOfferProps = useMemo(() => {
    if (!sanityOfferLp) throw new Error('Expected valid Featured Offer data');

    return {
      featuredOfferTitle: sanityOfferLp?.FeaturedOfferTitle,
      title: featuredOffer?.titleAndSlug.title,
      slug: featuredOffer?.titleAndSlug.slug.current,
      startDateTime: featuredOffer?.startEndDateTime?.startDateTime,
      endDateTime: featuredOffer?.startEndDateTime?.endDateTime,
      description: featuredOffer?._rawDescription,
      OfferImage: featuredOffer?.OfferImage,
      offerLocation: featuredOffer?.OfferLocation,
      url: featuredOffer?.Learn_More_URL?.url as string,
      caption: featuredOffer?.Learn_More_URL?.caption as string,
      retailers: featuredOffer?.retailers.map((retailer) => ({
        retailerTitle: retailer?.titleAndSlug.title,
        retailerSlug: retailer?.titleAndSlug.slug.current,
        retailerPoster: retailer?.poster,
        retailerHours: retailer?.hours.map((hour) => ({
          day: hour?.day,
          opensAt: hour?.opensAt,
          closesAt: hour?.closesAt,
        })),
        retailerContactInfo: retailer?.contactsInfo.map((contact) => ({
          type: contact?.type,
          value: contact?.value,
        })),
        retailerLocation: retailer?.location,
        retailerMapId: retailer?.mapId,
        retailerCategory: retailer?.category.category,
      })),
    };
  }, [featuredOffer, sanityOfferLp]);

  return (
    <Section {...props}>
      <Container sx={{py: 4}}>
        <IntroText
          center={true}
          sx={{mx: 'auto'}}
          caption="Whether you’re here to shop, dine, or explore, these special offers can help you make the most of every visit to Rockefeller Center."
        />
        <Grid columns={[1, 1, 2]} gap={[2, 8]} py={[3, 5, 5]}>
          <Box>
            <Box>
              <H
                sx={{
                  fontWeight: 500,
                  fontSize: '18px',
                  textTransform: 'capitalize',
                  // mt: 4,
                }}
              >
                {featuredOfferProps.featuredOfferTitle}
              </H>
              <H
                sx={{
                  variant: 'styles.h1',
                  my: 3,
                  fontFamily: 'headingSecondary',
                }}
              >
                {featuredOfferProps.title}
              </H>
              <Text
                variant="eyebrow"
                sx={{
                  mt: 3,
                  mb: 3,
                  fontSize: 18,
                  display: 'flex',
                  flexWrap: 'wrap',
                  fontWeight: 'light',
                }}
              >
                <Spacer>
                  {featuredOfferProps.startDateTime}—
                  {featuredOfferProps.endDateTime}
                </Spacer>
                {featuredOfferProps.retailers ? (
                  featuredOfferProps.retailers.length > 1 ? (
                    <Spacer>{featuredOfferProps.offerLocation?.title}</Spacer>
                  ) : (
                    <Spacer>{firstRetailer?.titleAndSlug.title}</Spacer>
                  )
                ) : null}
              </Text>
            </Box>
            <Text
              sx={{
                variant: 'smallP',
                mb: 4,
                display: ['block'],
              }}
            >
              {featuredOfferProps.description && (
                <SanityRichText
                  blocks={
                    (featuredOfferProps.description as unknown) as Block[]
                  }
                />
              )}
            </Text>
            <Box>
              {featuredOfferProps.retailers &&
              featuredOfferProps.retailers.length === 1 ? (
                <Grid columns={[1, 2]} gap={[2, 4]} sx={{py: 2}}>
                  {
                    <HoursAndAddress
                      addressHeading="Contact & Directions"
                      location={getLocationProps(firstRetailer?.location)}
                      contactsInfo={firstRetailer?.contactsInfo?.map((info) =>
                        getContactsInfoProps(info),
                      )}
                    />
                  }
                  {firstRetailer?.hours && (
                    <HoursAndAddress
                      hoursHeading="Hours"
                      hours={getHoursProps(firstRetailer)}
                    />
                  )}
                </Grid>
              ) : (
                <Box>
                  <Text sx={{fontWeight: 500, fontSize: [18, 24]}}>
                    Participating retailers include:
                  </Text>
                  <Grid
                    columns={[1, 2]}
                    sx={{pt: 2, pb: [5], columnGap: [1, 4], rowGap: [0, 1]}}
                  >
                    {featuredOfferProps.retailers &&
                      featuredOfferProps.retailers.map((retailer, index) => {
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
                            sx={{maxWidth: 'max-content'}}
                          >
                            <Text sx={{fontSize: [16, 18]}} key={index}>
                              {retailer.retailerTitle}
                            </Text>
                          </Link>
                        );
                      })}
                  </Grid>
                </Box>
              )}
            </Box>
            {featuredOfferProps.retailers &&
              featuredOfferProps.retailers.length === 1 && (
                <Box>
                  <Link
                    sx={{
                      mb: 4,
                      display: ['inline-block'],
                    }}
                    variant="underline"
                    href={`https://www.google.com/maps/search/?api=1&query= ${firstRetailer?.titleAndSlug.title} ${firstRetailer?.location.address1}`}
                  >
                    VIEW ON MAP
                  </Link>
                </Box>
              )}
            {featuredOfferProps.url && (
              <Link href={`${featuredOfferProps.url}`}>
                <Button
                  sx={{
                    width: ['100%', 'initial'],
                    mt: 2,
                  }}
                >
                  {featuredOfferProps.caption
                    ? featuredOfferProps.caption
                    : 'LEARN MORE'}
                </Button>
              </Link>
            )}
          </Box>
          <IntrinsicBox sx={{pt: [46, 0]}}>
            <IntrinsicImage
              ratio={[16 / 20, null, 13 / 20]}
              minWidth={[285, '100%']}
              {...getSanityFluidImageProps(
                featuredOfferProps.OfferImage
                  ? featuredOfferProps.OfferImage
                  : featuredOfferProps.retailers && firstRetailer?.poster,
              )}
            />
          </IntrinsicBox>
        </Grid>
      </Container>
    </Section>
  );
};

export default SpecialOffersHeroBlock;
