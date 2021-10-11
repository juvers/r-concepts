/**@jsx jsx */
import {
  jsx,
  Section,
  Container,
  CalloutGrid,
  CalloutGridCard,
  CalloutGridCardProps,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const PARTNERSHIP_CALLOUT_GRID_QUERY = graphql`
  query PartnershipCalloutGrid {
    dataJson(id: {eq: "partnerships"}) {
      partnershipCalloutGrid {
        title
        caption
        links {
          url
          label
        }
        cards {
          title
          caption
          description
          customCardType
          image {
            src {
              fluid {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
            alt
          }
          width
          height
        }
      }
    }
  }
`;

const PartnershipCalloutCardGridBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.PartnershipCalloutGridQuery>(
    PARTNERSHIP_CALLOUT_GRID_QUERY,
  );

  invariant(dataJson, 'Partnership JSON data is required!');

  const cards: CalloutGridCardProps[] = useMemo(() => {
    return dataJson.partnershipCalloutGrid.cards.map((card, index) => {
      return {
        index: index,
        title: card.title,
        caption: card.caption,
        description: card.description,
        alt: card.image.alt,
        maxWidth: card.width,
        customCardType: card.customCardType,
        fluid: card.image.src.fluid,
      };
    });
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{pt: 7, pb: 1}}>
        <CalloutGrid
          title={dataJson?.partnershipCalloutGrid?.title}
          caption={dataJson?.partnershipCalloutGrid?.caption}
          links={dataJson?.partnershipCalloutGrid?.links}
          sx={{mb: [0, 0]}}
        >
          {cards.map((card) => (
            <CalloutGridCard key={card.index} {...card} />
          ))}
        </CalloutGrid>
      </Container>
    </Section>
  );
};

export default PartnershipCalloutCardGridBlock;
