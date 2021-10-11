/** @jsx jsx */
import {jsx, AnchorSection, TicketCarousel} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const TOR_TICKET_OFFERINGS_QUERY = graphql`
  query TorTicketOfferings {
    sanityTicketCategory(
      titleAndSlug: {slug: {current: {eq: "top-of-the-rock-observation-deck"}}}
    ) {
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

export default function TorTicketOfferingsBlock(
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element {
  const {
    sanityTicketCategory,
  } = useStaticQuery<GatsbyTypes.TorTicketOfferingsQuery>(
    TOR_TICKET_OFFERINGS_QUERY,
  );

  invariant(sanityTicketCategory, 'TOR ticket data is required!');
  const {tickets} = sanityTicketCategory;
  invariant(tickets?.length, 'TOR ticket offerings are required!');

  const torTicketOfferingsProps = useMemo(() => {
    return tickets.map((ticket) => {
      invariant(ticket, 'TOR ticket offering is required!');
      invariant(
        ticket.image?.asset?.fluid,
        'TOR ticket offering image is required!',
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
      <TicketCarousel title="Ticket Offerings" data={torTicketOfferingsProps} />
    </AnchorSection>
  );
}
