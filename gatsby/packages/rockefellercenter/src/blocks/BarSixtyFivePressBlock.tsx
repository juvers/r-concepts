/** @jsx jsx */
import {jsx, Section, PressCarousel} from '@tishman/components';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {useStaticQuery, graphql} from 'gatsby';

const BAR_SIXTY_FIVE_PRESS_QUERY = graphql`
  query BarSixtyFivePress {
    sanityAttractionBar(_id: {eq: "bar65"}, _type: {eq: "attraction.bar"}) {
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

const BarSixtyFivePressBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    sanityAttractionBar,
  } = useStaticQuery<GatsbyTypes.BarSixtyFivePressQuery>(
    BAR_SIXTY_FIVE_PRESS_QUERY,
  );

  const cards = useMemo(() => {
    if (!sanityAttractionBar)
      throw new Error('Expected valid BarSixtyFive room sanity data');

    if (
      !sanityAttractionBar?.featuredNewsPress ||
      sanityAttractionBar?.featuredNewsPress.length < 1
    )
      throw new Error('Expected valid BarSixtyFive room press items');

    return sanityAttractionBar.featuredNewsPress.map((item) => {
      if (!item?.source) throw new Error('Expected featuredNewsPress source');
      if (!item?.excerpt) throw new Error('Expected featuredNewsPress excerpt');

      return {
        source: item.source,
        excerpt: item.excerpt,
        externalLinks: item.externalLinks,
      };
    });
  }, [sanityAttractionBar]);

  return (
    <Section {...props}>
      <PressCarousel name="Press" cards={cards} />
    </Section>
  );
};

export default BarSixtyFivePressBlock;
