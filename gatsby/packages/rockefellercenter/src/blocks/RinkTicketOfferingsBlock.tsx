/** @jsx jsx */
import {jsx, AnchorSection, TicketCarousel} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const RINK_TICKET_OFFERINGS_QUERY = graphql`
  query RinkTicketOfferings {
    sanityTicketCategory(titleAndSlug: {slug: {current: {eq: "the-rink"}}}) {
      tickets {
        title
        description: _rawDescription(resolveReferences: {maxDepth: 10})
        price
        url {
          caption
          url
        }
        image {
          alt
          asset {
            fluid(maxWidth: 572, maxHeight: 516) {
              ...GatsbySanityImageFluid
            }
          }
        }
      }
    }
  }
`;

export default function RinkTicketOfferingsBlock(
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element {
  const {
    sanityTicketCategory,
  } = useStaticQuery<GatsbyTypes.RinkTicketOfferingsQuery>(
    RINK_TICKET_OFFERINGS_QUERY,
  );

  invariant(sanityTicketCategory, 'Rink ticket data is required!');
  const {tickets} = sanityTicketCategory;
  invariant(tickets?.length, 'Rink ticket offerings are required!');

  const rinkTicketOfferingsProps = useMemo(() => {
    return tickets.map((ticket) => {
      invariant(ticket, 'Rink ticket offering is required!');
      invariant(
        ticket.image?.asset?.fluid,
        'Rink ticket offering image is required!',
      );
      return {
        title: ticket.title,
        src: ticket.image.asset.fluid,
        alt: ticket.image.alt,
        description: ticket.description,
        label: 'Buy Tickets',
        price: ticket.price,
        href: ticket.url?.url,
      };
    });
  }, [tickets]);

  return (
    <AnchorSection {...props}>
      <TicketCarousel
        title="Ticket Offerings"
        data={rinkTicketOfferingsProps}
      />
    </AnchorSection>
  );
}
