/**@jsx jsx */
import {
  jsx,
  Section,
  Container,
  CalloutGridCardFull,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const WORKING_COMMUNITY_FULL_CALLOUT_CARD_QUERY = graphql`
  query WorkingCommunityFullCalloutCard {
    dataJson(id: {eq: "working-community"}) {
      workingCommunityFullCard {
        title
        caption
        description
        image {
          src {
            fluid(maxWidth: 1200) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
          alt
        }
        links {
          label
          url
        }
      }
    }
  }
`;

const WorkingCommunityFullCalloutCardBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    dataJson,
  } = useStaticQuery<GatsbyTypes.WorkingCommunityFullCalloutCardQuery>(
    WORKING_COMMUNITY_FULL_CALLOUT_CARD_QUERY,
  );

  invariant(dataJson, 'Working Community JSON data is required');

  const workingCommunityFullCalloutCardData = useMemo(() => {
    return {
      title: dataJson.workingCommunityFullCard.title,
      caption: dataJson.workingCommunityFullCard.caption,
      description: dataJson.workingCommunityFullCard.description,
      fluid: dataJson.workingCommunityFullCard.image.src.fluid,
      alt: dataJson.workingCommunityFullCard.image.alt,
      links:
        dataJson.workingCommunityFullCard.links &&
        dataJson.workingCommunityFullCard.links.map((link) => link),
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{pt: [6, 4, 8], pb: [2, 4, 8], mb: 0}}>
        <CalloutGridCardFull {...workingCommunityFullCalloutCardData} />
      </Container>
    </Section>
  );
};

export default WorkingCommunityFullCalloutCardBlock;
