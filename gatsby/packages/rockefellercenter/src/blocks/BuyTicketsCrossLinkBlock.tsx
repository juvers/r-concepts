/** @jsx jsx */
import {jsx, Flex, Section, Container, CrossLink} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const BUY_TICKETS_CROSS_LINK_QUERY = graphql`
  query BuyTicketsCrossLink {
    dataJson(id: {eq: "buy-tickets"}) {
      crossLinks {
        image {
          src {
            fluid(maxWidth: 700) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
          alt
        }
        caption
        title
        link {
          label
          url
        }
      }
    }
  }
`;

const BuyTicketsCrossLinkBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.BuyTicketsCrossLinkQuery>(
    BUY_TICKETS_CROSS_LINK_QUERY,
  );

  invariant(dataJson, 'Rink JSON data is required!');

  const buyTicketsCrossLinkProps = useMemo(() => {
    return dataJson.crossLinks.map((crossLink) => ({
      fluid: crossLink.image.src.fluid,
      alt: crossLink.image.alt,
      caption: crossLink.caption,
      title: crossLink.title,
      link: crossLink.link,
    }));
  }, [dataJson]);

  return (
    buyTicketsCrossLinkProps && (
      <Section {...props}>
        <Container sx={{pt: [4, 7], pb: 8, px: 0}}>
          <Flex
            sx={{
              justifyContent: 'space-between',
              flexDirection: ['column', null, 'row'],
            }}
          >
            {buyTicketsCrossLinkProps.map((crossLink) => (
              <CrossLink key={crossLink.title} {...crossLink} />
            ))}
          </Flex>
        </Container>
      </Section>
    )
  );
};

export default BuyTicketsCrossLinkBlock;
