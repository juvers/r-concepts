/**@jsx jsx */
import {useState, useMemo} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import {FluidObject} from 'gatsby-image';
import {
  jsx,
  Box,
  Text,
  Grid,
  Select,
  TabMenu,
  Container,
  FaqContainer,
  usePagination,
  IntrinsicImage,
  Section,
} from '@tishman/components';

import type {ComponentPropsWithoutRef} from 'react';

import type {Block} from '@sanity/block-content-to-react';

interface FaqProps {
  faqs: {category: string}[];
  _rawFaqs: Block[];
  image: {
    asset: {
      fluid: FluidObject;
    };
    hotspot: {
      x: number;
      y: number;
    };
    caption: string;
  };
}

export const galleryImageFragment = graphql`
  fragment galleryImageFragment on SanityGallery {
    items {
      __typename
      ... on SanityImageType {
        asset {
          fluid {
            ...GatsbySanityImageFluid
          }
        }
        hotspot {
          y
          x
        }
        caption
      }
    }
  }
`;

const FAQS_QUERY = graphql`
  query FaqsBlock {
    general: sanityGeneralFaqs(
      _id: {eq: "general-faqs"}
      _type: {eq: "generalFaqs"}
    ) {
      _rawFaqs
      faqs {
        category
      }
      gallery {
        ...galleryImageFragment
      }
    }
    tor: sanityAttractionTor(
      _id: {eq: "topOfTheRock"}
      _type: {eq: "attraction.tor"}
    ) {
      _rawFaqs
      faqs {
        category
      }
      gallery {
        ...galleryImageFragment
      }
    }
    rink: sanityAttractionRink(
      _id: {eq: "theRink"}
      _type: {eq: "attraction.rink"}
    ) {
      _rawFaqs
      faqs {
        category
      }
      gallery {
        ...galleryImageFragment
      }
    }
  }
`;

const FaqsBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {tor, rink, general} = useStaticQuery<GatsbyTypes.FaqsBlockQuery>(
    FAQS_QUERY,
  );

  const torData = useMemo(() => {
    if (!tor) throw new Error('Expected Top of the Rock Attraction data');
    if (!tor?._rawFaqs)
      throw new Error('Expected raw Top of the Rock faq data');
    if (!tor?.faqs) throw new Error('Expected Top of the Rock faq categories');
    if (!tor?.gallery?.items)
      throw new Error('Expected Top of the Rock Images images');

    return {
      faqs: (tor.faqs as unknown) as FaqProps['faqs'],
      _rawFaqs: (tor._rawFaqs as unknown) as FaqProps['_rawFaqs'],
      image: tor.gallery.items.find(
        (item) => item?.__typename === 'SanityImageType',
      ),
    } as FaqProps;
  }, [tor]);

  const rinkData = useMemo(() => {
    if (!rink) throw new Error('Expected The Rink Attraction data');
    if (!rink?._rawFaqs) throw new Error('Expected raw The Rink faq data');
    if (!rink?.faqs) throw new Error('Expected The Rink faq categories');
    if (!rink?.gallery?.items)
      throw new Error('Expected The Rink gallery images');

    return {
      faqs: (rink.faqs as unknown) as FaqProps['faqs'],
      _rawFaqs: (rink._rawFaqs as unknown) as FaqProps['_rawFaqs'],
      image: rink.gallery.items.find(
        (item) => item?.__typename === 'SanityImageType',
      ),
    } as FaqProps;
  }, [rink]);

  const generalData = useMemo(() => {
    if (!general) throw new Error('Expected General faq data');
    if (!general?._rawFaqs) throw new Error('Expected raw General faq data');
    if (!general?.faqs) throw new Error('Expected General faq categories');
    if (!general?.gallery?.items)
      throw new Error('Expected General gallery images');

    return {
      faqs: (general.faqs as unknown) as FaqProps['faqs'],
      _rawFaqs: (general._rawFaqs as unknown) as FaqProps['_rawFaqs'],
      image: general.gallery.items.find(
        (item) => item?.__typename === 'SanityImageType',
      ),
    } as FaqProps;
  }, [general]);

  const faqData = {
    torData,
    rinkData,
    generalData,
  };
  const [dataset, setDataset] = useState<FaqProps>(faqData.generalData);
  const {page, setPages, goto} = usePagination({pages: dataset.faqs.length});
  return (
    <Section {...props}>
      <Container sx={{mt: [4, 7], mb: [7, 9], height: '100%'}}>
        <Grid
          sx={{
            gridTemplateColumns: ['1fr', null, '346px 1fr'],
            gridGap: [0, null, 5, 7, 8],
          }}
        >
          <Box>
            <Text
              sx={{
                fontSize: 3,
                fontWeight: 'medium',
                color: 'accent',
              }}
            >
              Select a Topic
            </Text>
            <Select
              defaultValue="generalData"
              sx={{fontSize: [3, 5], fontWeight: 'regular'}}
              name="topic"
              onChange={(e) => {
                setPages(
                  faqData[e.target.value as keyof typeof faqData].faqs.length,
                );
                goto(0);
                setDataset(faqData[e.target.value as keyof typeof faqData]);
              }}
            >
              <option value="generalData">General</option>
              <option value="torData">Top of the Rock</option>
              <option value="rinkData">The Rink</option>
            </Select>
            <Box
              sx={{
                width: '100%',
                position: 'sticky',
                top: [0, 5],
              }}
            >
              {dataset.image && (
                <IntrinsicImage
                  ratio={[632 / 346, null, 146 / 284]}
                  maxWidth={'100%'}
                  fluid={dataset?.image.asset.fluid}
                  alt={dataset?.image.caption}
                  imgStyle={{
                    objectPosition:
                      dataset?.image?.hotspot &&
                      `${dataset?.image.hotspot.x * 100}% ${
                        dataset?.image.hotspot.y * 100
                      }%`,
                  }}
                />
              )}
            </Box>
          </Box>
          <Box sx={{pt: dataset?.faqs ? 4 : 3}}>
            {dataset?.faqs && (
              <TabMenu
                tab={page}
                labels={dataset.faqs.map(({category}) => category)}
                onTabChange={goto}
              />
            )}
            {dataset?._rawFaqs && (
              <FaqContainer faqs={dataset._rawFaqs[page].faqs as Block[]} />
            )}
          </Box>
        </Grid>
      </Container>
    </Section>
  );
};

export default FaqsBlock;
