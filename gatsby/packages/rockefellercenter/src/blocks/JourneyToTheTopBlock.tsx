/**@jsx jsx */
import {jsx, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import JourneyToTheTop from '~components/JourneyToTheTop';
import invariant from 'invariant';

const JOURNEY_TO_THE_TOP_QUERY = graphql`
  query JourneyToTheTop {
    dataJson(id: {eq: "top-of-the-rock-observation-deck"}) {
      torJourneyToTheTopItems {
        title
        caption
        image {
          src {
            fluid(maxWidth: 700) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
          alt
        }
      }
    }
  }
`;

const JourneyToTheTopBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.JourneyToTheTopQuery>(
    JOURNEY_TO_THE_TOP_QUERY,
  );

  invariant(dataJson, 'TOR JSON data is required!');

  const journeyToTheTopProps = useMemo(() => {
    const items = dataJson.torJourneyToTheTopItems.map((item) => {
      return {
        index: 0,
        onClick: () => 0,
        title: item.title,
        caption: item.caption,
        fluid: item.image.src.fluid,
        alt: item.image.alt,
      };
    });
    return {items};
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{px: [3, 5], py: 5}}>
        <JourneyToTheTop {...journeyToTheTopProps} />
      </Container>
    </Section>
  );
};

export default JourneyToTheTopBlock;
