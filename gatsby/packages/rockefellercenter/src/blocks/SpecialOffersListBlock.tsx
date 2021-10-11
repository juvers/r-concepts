/**@jsx jsx */
import {jsx, Section, Container, Box} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import SpecialOffersListItem from '~blocks/SpecialOffersListItem';
import type {Block} from '@sanity/block-content-to-react';

const SPECIAL_OFFERS_LIST_QUERY = graphql`
  query SpecialOffersList {
    sanityOfferLp {
      offers {
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

const SpecialOffersListBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element | null => {
  const {sanityOfferLp} = useStaticQuery<GatsbyTypes.SpecialOffersListQuery>(
    SPECIAL_OFFERS_LIST_QUERY,
  );

  const allOffers = sanityOfferLp?.offers;

  const offersProps = useMemo(() => {
    if (!sanityOfferLp) throw new Error('Expected valid Featured Offer data');

    return {
      offers: allOffers?.map((offer) => ({
        title: offer?.titleAndSlug.title,
        slug: offer?.titleAndSlug.slug.current,
        offerImage: offer?.OfferImage,
        startDateTime: offer?.startEndDateTime?.startDateTime,
        endDateTime: offer?.startEndDateTime?.endDateTime,
        offerLocation: offer?.OfferLocation,
        description: (offer?._rawDescription as unknown) as Block[],
        note: offer?.Note,
        url: offer?.Learn_More_URL?.url as string,
        caption: offer?.Learn_More_URL?.caption as string,
        retailers: offer?.retailers.map((retailer) => ({
          retailerTitle: retailer?.titleAndSlug.title,
          retailerSlug: retailer?.titleAndSlug.slug.current,
          retailerPoster: retailer?.poster,
          retailerHours: retailer?.hours.map((hour) => ({
            day: hour?.day,
            opensAt: hour?.opensAt,
            closesAt: hour?.closesAt,
          })),
          retailerContactInfo: retailer?.contactsInfo.map((contact) => ({
            type: contact?.type as string,
            value: contact?.value as string,
          })),
          retailerLocation: retailer?.location,
          retailerMapId: retailer?.mapId,
          retailerCategory: retailer?.category.category,
        })),
      })),
    };
  }, [allOffers, sanityOfferLp]);

  return (
    <Section {...props}>
      {allOffers && allOffers.length >= 1 && (
        <Container>
          <Box sx={{maxWidth: 1070, margin: 'auto', px: [0, 48]}}>
            <H
              sx={{
                variant: 'styles.h1',
                fontSize: [32, 46],
                // px: [0, 0, 48],
                pt: [46, 46, 58],
                pb: [23, 23, 30],
                fontFamily: 'headingSecondary',
              }}
            >
              All Offers
            </H>
          </Box>
          {offersProps.offers?.map((offer, index) => (
            <SpecialOffersListItem {...offer} key={index} />
          ))}
        </Container>
      )}
    </Section>
  );
};

export default SpecialOffersListBlock;
