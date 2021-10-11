/**@jsx jsx */
import {jsx, Section, FlexSpace} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {getSanityFluidImageProps} from '~blocks/utils';

const HOME_FLEX_SPACE_QUERY = graphql`
  query HomeFlexSpace {
    sanityHomePage(_type: {eq: "homePage"}) {
      flexSpaceField {
        bgImage {
          alt
          asset {
            fluid(maxWidth: 2500) {
              ...GatsbySanityImageFluid
            }
          }
        }
        spaceOne {
          title
          description
          link {
            url
            label: caption
          }
        }
        spaceTwo {
          title
          description
          link {
            url
            label: caption
          }
        }
      }
    }
  }
`;
const HomeFlexSpaceBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element | null => {
  const {sanityHomePage} = useStaticQuery<GatsbyTypes.HomeFlexSpaceQuery>(
    HOME_FLEX_SPACE_QUERY,
  );

  const flexSpaceField = sanityHomePage?.flexSpaceField;

  const data = useMemo(() => {
    if (!flexSpaceField) return null;

    if (!flexSpaceField.spaceOne) throw new Error('Expected spaceOne data');
    if (!flexSpaceField.spaceOne.title)
      throw new Error('Expected spaceOne title');
    if (!flexSpaceField?.spaceOne?.link?.url)
      throw new Error('Expected spaceOne link url');
    if (!flexSpaceField.spaceOne.link.label)
      throw new Error('Expected spaceOne link label');

    const bgImage = getSanityFluidImageProps(flexSpaceField.bgImage);

    return {
      bgImage: bgImage.fluid,
      spaceOne: {
        title: flexSpaceField.spaceOne.title,
        description: flexSpaceField.spaceOne?.description,
        link: flexSpaceField.spaceOne.link,
      },
      spaceTwo: {
        title: flexSpaceField?.spaceTwo?.title,
        description: flexSpaceField?.spaceTwo?.description,
        link: flexSpaceField?.spaceTwo?.link,
      },
    };
  }, [flexSpaceField]);

  return (
    data && (
      <Section {...props}>
        <FlexSpace {...data} />
      </Section>
    )
  );
};

export default HomeFlexSpaceBlock;
