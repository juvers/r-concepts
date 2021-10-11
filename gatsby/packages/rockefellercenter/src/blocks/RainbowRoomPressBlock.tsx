/** @jsx jsx */
import {jsx, Section, PressCarousel} from '@tishman/components';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {useStaticQuery, graphql} from 'gatsby';

const RAINBOW_ROOM_PRESS_QUERY = graphql`
  query RainbowRoomPress {
    sanityAttractionRainbow(
      _id: {eq: "rainbowRoom"}
      _type: {eq: "attraction.rainbow"}
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

const RainbowRoomPressBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    sanityAttractionRainbow,
  } = useStaticQuery<GatsbyTypes.RainbowRoomPressQuery>(
    RAINBOW_ROOM_PRESS_QUERY,
  );

  const cards = useMemo(() => {
    if (!sanityAttractionRainbow)
      throw new Error('Expected valid rainbow room sanity data');

    if (
      !sanityAttractionRainbow?.featuredNewsPress ||
      sanityAttractionRainbow?.featuredNewsPress.length < 1
    )
      throw new Error('Expected valid rainbow room press items');

    return sanityAttractionRainbow.featuredNewsPress.map((item) => {
      if (!item?.source) throw new Error('Expected featuredNewsPress source');
      if (!item?.excerpt) throw new Error('Expected featuredNewsPress excerpt');

      return {
        source: item.source,
        excerpt: item.excerpt,
        externalLinks: item.externalLinks,
      };
    });
  }, [sanityAttractionRainbow]);

  return (
    <Section {...props}>
      <PressCarousel name="Press" cards={cards} />
    </Section>
  );
};

export default RainbowRoomPressBlock;
