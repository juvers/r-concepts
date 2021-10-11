/** @jsx jsx */
import {jsx, Section, PressCarousel} from '@tishman/components';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {useStaticQuery, graphql} from 'gatsby';

const HOLIDAYS_PRESS_QUERY = graphql`
  query HolidaysPress {
    sanityAttractionHoliday(
      _id: {eq: "theHolidays"}
      _type: {eq: "attraction.holiday"}
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

const HolidaysPressBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    sanityAttractionHoliday,
  } = useStaticQuery<GatsbyTypes.HolidaysPressQuery>(HOLIDAYS_PRESS_QUERY);

  const cards = useMemo(() => {
    if (!sanityAttractionHoliday)
      throw new Error('Expected valid holidays sanity data');

    if (
      !sanityAttractionHoliday?.featuredNewsPress ||
      sanityAttractionHoliday?.featuredNewsPress.length < 1
    )
      throw new Error('Expected valid holidays press items');

    return sanityAttractionHoliday.featuredNewsPress.map((item) => {
      if (!item?.source) throw new Error('Expected featuredNewsPress source');
      if (!item?.excerpt) throw new Error('Expected featuredNewsPress excerpt');

      return {
        source: item.source,
        excerpt: item.excerpt,
        externalLinks: item.externalLinks,
      };
    });
  }, [sanityAttractionHoliday]);

  return (
    <Section {...props}>
      <PressCarousel name="Press" cards={cards} />
    </Section>
  );
};

export default HolidaysPressBlock;
