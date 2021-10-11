/**@jsx jsx */
import {
  jsx,
  Section,
  Grid,
  Container,
  ExecutiveCard,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import {getSanityFluidImageProps} from '~blocks/utils';
import type {ComponentPropsWithoutRef} from 'react';

const EXECUTIVE_CARD_QUERY = graphql`
  query ExecutiveCard {
    allSanityExecutive {
      nodes {
        name
        title
        image {
          alt
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
        }
      }
    }
  }
`;

const ExecutiveCardBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {allSanityExecutive} = useStaticQuery<GatsbyTypes.ExecutiveCardQuery>(
    EXECUTIVE_CARD_QUERY,
  );
  const cards = useMemo(() => {
    return allSanityExecutive.nodes.map((item) => {
      if (!item?.title) throw new Error('Expected executive title');
      if (!item?.name) throw new Error('Expected executive name');

      return {
        title: item.title,
        name: item.name,
        link: {
          url: `/executive-team/${encodeURI(
            item.name
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/gi, '-'),
          )}`,
          label: `Learn more about ${item.name.split(' ')[0]}`,
        },
        ...getSanityFluidImageProps(item.image),
      };
    });
  }, [allSanityExecutive]);

  return (
    <Section {...props}>
      <Container>
        <Grid
          sx={{
            my: [5, 7],
            gridTemplateColumns: ['1fr', '1fr 1fr'],
            justifyContent: ['center', 'unset'],
            gridRowGap: 5,
          }}
        >
          {cards.map((card) => (
            <ExecutiveCard key={card.name} {...card} />
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default ExecutiveCardBlock;
