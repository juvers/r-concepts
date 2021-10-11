/**@jsx jsx */
import {jsx, AnchorSection, TicketComparisonTool} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const TOR_TICKET_COMPARISON_QUERY = graphql`
  query TorTicketComparison {
    dataJson(id: {eq: "top-of-the-rock-observation-deck"}) {
      torComparisonTool {
        title
        subTitle
        passes {
          link {
            label
            url
          }
          caption
        }
        ticketFeatures {
          admission
          views
          levels
          timeLimit
          entry
          elevator
          merchandise
          schedule
          visit
          save
          valid
          choice
          saveUpTo
        }
      }
      ticketOfferings {
        image {
          alt
          src {
            fluid {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        title
        price
        link {
          url
          label
        }
        ticketFeatures {
          admission
          views
          levels
          timeLimit
          entry
          elevator
          merchandise
          schedule
          visit
          save
          valid
          choice
          saveUpTo
        }
      }
    }
  }
`;

const TorTicketComparisonToolBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.TorTicketComparisonQuery>(
    TOR_TICKET_COMPARISON_QUERY,
  );

  invariant(dataJson, 'Tor JSON data is required!');

  const ticketComparisonToolProps = useMemo(() => {
    return {
      title: dataJson.torComparisonTool.title,
      subTitle: dataJson.torComparisonTool.title,
      passes: {
        caption: dataJson.torComparisonTool.passes.caption,
        link: dataJson.torComparisonTool.passes.link,
      },
      featureList: dataJson.torComparisonTool.ticketFeatures,
      tickets: dataJson.ticketOfferings.map((ticket) => {
        // since ticket features is not required in ticketOfferings type
        // we need to ensure it exists to be able to correctly display
        // the ticket comparison tool
        if (!ticket.ticketFeatures)
          throw new Error(
            'Ticket comparison tool requires Ticket Features list',
          );
        return {
          title: ticket.title,
          src: ticket.image.src.fluid,
          href: ticket?.link?.url,
          label: ticket?.link?.label,
          price: ticket.price,
          alt: ticket.image.alt,
          ticketFeatures: ticket.ticketFeatures,
          featureList: dataJson.torComparisonTool.ticketFeatures,
        };
      }),
    };
  }, [dataJson]);

  return (
    <AnchorSection {...props}>
      <TicketComparisonTool {...ticketComparisonToolProps} />
    </AnchorSection>
  );
};

export default TorTicketComparisonToolBlock;
