/** @jsx jsx */
import {jsx, AnchorSection, PressCarousel} from '@tishman/components';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {useStaticQuery, graphql} from 'gatsby';

const WEDDINGS_PRESS_QUERY = graphql`
  query WeddingsPress {
    sanityAttractionWedding(
      _id: {eq: "wedding"}
      _type: {eq: "attraction.wedding"}
    ) {
      featuredNewsPress {
        source
        excerpt
        externalLinks {
          ... on SanityUrlType {
            url
            caption
          }
        }
      }
    }
  }
`;

const WeddingsPressBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {
    sanityAttractionWedding,
  } = useStaticQuery<GatsbyTypes.WeddingsPressQuery>(WEDDINGS_PRESS_QUERY);

  const cards = useMemo(() => {
    if (!sanityAttractionWedding)
      throw new Error('Expected valid wedding room sanity data');

    if (
      !sanityAttractionWedding?.featuredNewsPress ||
      sanityAttractionWedding?.featuredNewsPress.length < 1
    )
      throw new Error('Expected valid wedding room press items');

    return sanityAttractionWedding.featuredNewsPress.map((item) => {
      if (!item?.source) throw new Error('Expected featuredNewsPress source');
      if (!item?.excerpt) throw new Error('Expected featuredNewsPress excerpt');

      return {
        source: item.source,
        excerpt: item.excerpt,
        externalLinks: item.externalLinks,
      };
    });
  }, [sanityAttractionWedding]);

  return (
    <AnchorSection {...props}>
      <PressCarousel name="Press" cards={cards} />
    </AnchorSection>
  );
};

export default WeddingsPressBlock;
