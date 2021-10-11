/**@jsx jsx */
import {jsx, OnlyHere, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {getSanityFluidImageProps} from '~blocks/utils';

const ONLY_HERE_QUERY = graphql`
  query OnlyHere {
    sanityHomePage(_type: {eq: "homePage"}) {
      OnlyHereAttractions {
        sectionCaption
        attractionList {
          title
          link {
            label
            url
          }
          image {
            alt
            caption
            asset {
              fluid {
                ...GatsbySanityImageFluid
              }
            }
          }
        }
      }
    }
  }
`;

const OnlyHereBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {sanityHomePage} = useStaticQuery<GatsbyTypes.OnlyHereQuery>(
    ONLY_HERE_QUERY,
  );
  const attractions = sanityHomePage?.OnlyHereAttractions?.attractionList;
  const data = useMemo(() => {
    if (!sanityHomePage) throw new Error('Expected valid home page data');
    if (!sanityHomePage.OnlyHereAttractions)
      throw new Error('Expected valid only here attractions data');

    if (!sanityHomePage.OnlyHereAttractions.sectionCaption)
      throw new Error('Expected valid sectionCaption data');
    const caption = sanityHomePage.OnlyHereAttractions.sectionCaption;

    if (!attractions) throw new Error('Expected valid Attraction data');
    const cards = attractions.map((attraction) => {
      if (!attraction) throw new Error('Expected valid object');
      if (!attraction?.title) throw new Error('Expected attraction title');
      if (!attraction?.link?.label)
        throw new Error('Expected attraction link label');
      if (!attraction?.link?.url)
        throw new Error('Expected attraction link url');
      const photo = getSanityFluidImageProps(attraction.image);

      return {
        title: attraction.title,
        link: attraction.link,
        fluid: photo.fluid,
        alt: photo.alt,
        description: photo.caption,
      };
    });

    return {
      caption,
      cards,
    };
  }, [sanityHomePage, attractions]);

  return (
    <Section {...props}>
      <OnlyHere caption={data.caption} cards={data.cards} />
    </Section>
  );
};
export default OnlyHereBlock;
