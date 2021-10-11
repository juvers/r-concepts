/**@jsx jsx */
import {jsx, Box, Text, Flex, Grid, Divider} from '@tishman/components';
import {H} from '@hzdg/sectioning';

interface PrivateEventComparisonTableProps {
  specs: Specs[];
  capacity: Capacity[];
}

interface Specs {
  squareFeet: number;
  ceilings?: string;
  dimensions?: string;
  title: string;
}
interface Capacity {
  title: string;
  capacities: {
    label: string;
    value: number;
  }[];
}

const rowStyles = {
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(0,0,0,0.14)',
  py: 4,
};

const cellStyles = {
  width: '100%',
  maxWidth: [92, '100%'],
};

export const PrivateEventComparisonTable = ({
  specs,
  capacity,
}: PrivateEventComparisonTableProps): JSX.Element => {
  const squareFeetList = specs.map(({squareFeet}) => squareFeet);
  const dimensionsList = specs.map(({dimensions}) => dimensions);
  const ceilingsList = specs.map(({ceilings}) => ceilings);
  const tableHeadings = specs.map(({title}) => title);

  const capacityGroup1 = capacity.slice(0, 3);
  const capacityGroup2 = capacity.slice(3);

  const renderSpecs = (
    list: (string | number | undefined)[],
    rowLabel: string,
  ) => (
    <Flex as="tr" sx={rowStyles}>
      <Box as="td" sx={cellStyles}>
        <Text>{rowLabel}</Text>
      </Box>
      {list.map((spec: string | number | undefined, index) => (
        <Box as="td" key={index} sx={cellStyles}>
          <Text variant="smallPrivateEventSpec">{spec ? spec : 'n/a'}</Text>
        </Box>
      ))}
    </Flex>
  );

  const renderCapacities = (
    {title, capacities}: Capacity,
    index: number,
    secondColumn = false,
  ) => (
    <Box sx={{mb: 4}} key={title}>
      <Flex sx={{justifyContent: 'space-between'}}>
        <H
          sx={{
            variant: 'styles.h5',
            fontSize: 3,
            maxWidth: [224, 374],
            mr: 4,
          }}
        >
          {title}
        </H>
        {index === 0 ? (
          <H
            sx={{
              variant: 'styles.h5',
              fontSize: 3,
              display: secondColumn ? ['none', null, 'block'] : 'block',
            }}
          >
            Capacity
          </H>
        ) : null}
      </Flex>
      {capacities.map(({label, value}, index) => (
        <Flex
          key={index}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <Text>{label}</Text>
          <Divider sx={{flex: '1 0 auto', ml: 2, mr: 1}} />
          <Text variant="smallPrivateEventSpec">{value}</Text>
        </Flex>
      ))}
    </Box>
  );

  return (
    <Box>
      <Box
        sx={{
          overflowX: 'scroll',
          scrollbarWidth: 'none',
          '::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <H
          sx={{
            variant: 'styles.h1',
            fontFamily: 'headingSecondary',
            position: 'absolute',
          }}
        >
          Specs
        </H>
        <Box
          as="table"
          sx={{
            width: [750, 1216],
            my: [6, 8],
            tableLayout: 'fixed',
          }}
        >
          <Box as="thead" sx={{borderBottom: '2px solid black'}}>
            <Flex as="tr" sx={{justifyContent: 'space-between', mb: 3}}>
              <Box as="td" sx={cellStyles} />
              {tableHeadings.map(
                (heading): JSX.Element => (
                  <Box as="td" key={heading} sx={cellStyles}>
                    <Text
                      sx={{
                        variant: 'styles.h5',
                        fontSize: 3,
                        mb: 0,
                      }}
                    >
                      {heading}
                    </Text>
                  </Box>
                ),
              )}
            </Flex>
          </Box>
          <Box as="tbody" sx={{mt: 3}}>
            {renderSpecs(squareFeetList, 'Max. Square feet:')}
            {renderSpecs(dimensionsList, 'Dimensions:')}
            {renderSpecs(ceilingsList, 'Ceilings:')}
          </Box>
        </Box>
      </Box>
      <Box>
        <H sx={{variant: 'styles.h1', fontFamily: 'headingSecondary'}}>
          Capacity
        </H>
        <Grid
          sx={{
            mt: [4, 6],
            mb: 6,
            gridColumnGap: 6,
            gridRowGap: 0,
            gridTemplateColumns: ['1fr', null, '1fr 1fr'],
          }}
        >
          <Box sx={{maxWidth: ['100%', 472]}}>
            {capacityGroup1?.map((capacity, index) =>
              renderCapacities(capacity, index),
            )}
          </Box>
          <Box sx={{maxWidth: ['100%', 472]}}>
            {capacityGroup2?.map((capacity, index) =>
              renderCapacities(capacity, index, true),
            )}
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};
