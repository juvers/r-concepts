/**@jsx jsx */
import {jsx, Box, Text, IntrinsicBox} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import invariant from 'invariant';
import {useMemo} from 'react';

const BUY_TICKETS_INSTRUCTIONS_QUERY = graphql`
  query BuyTicketsInstructions {
    dataJson(id: {eq: "buy-tickets"}) {
      printTickets {
        image {
          src {
            fluid {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
          alt
        }
      }
    }
  }
`;

export const PrintInstructions = (): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.BuyTicketsInstructionsQuery>(
    BUY_TICKETS_INSTRUCTIONS_QUERY,
  );

  invariant(dataJson, 'Buy Tickets print tickets JSON data is required!');

  const data = useMemo(() => {
    return {
      fluid: dataJson.printTickets.image.src.fluid,
      alt: dataJson.printTickets.image.alt,
    };
  }, [dataJson]);

  return (
    <Box
      sx={{
        p: [2, 4, 6],
        borderTop: 'dashed 1px #333',
        '@media print': {
          py: 4,
          pr: 4,
          pl: 5,
        },
      }}
    >
      <Text variant="mediumTitle" sx={{mb: [4, 6]}}>
        Folding instructions
      </Text>
      <IntrinsicBox ratio={735 / 832}>
        <img width="100%" src={data.fluid.src} alt={data.alt} />
      </IntrinsicBox>
    </Box>
  );
};
