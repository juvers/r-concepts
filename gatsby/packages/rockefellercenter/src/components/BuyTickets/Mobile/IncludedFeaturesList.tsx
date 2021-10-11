/**@jsx jsx */
import {
  jsx,
  CheckmarkSvg,
  Box,
  Text,
  OpenAccordionSvg,
  Flex,
} from '@tishman/components';
import type {TicketCategoryFeature} from '../types';
import {SanityRichText} from '@tishman/components';
import {useState} from 'react';

interface TicketFeaturesListProps {
  includedFeatures: TicketCategoryFeature[];
}

export const IncludedFeaturesList = ({
  includedFeatures,
}: TicketFeaturesListProps): JSX.Element => {
  const [isFeaturesListOpen, setIsFeaturesListOpen] = useState(false);

  return (
    <Box
      sx={{
        mt: '14px',
      }}
    >
      <Flex
        tabIndex={0}
        role="button"
        aria-pressed={isFeaturesListOpen}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => {
          setIsFeaturesListOpen(!isFeaturesListOpen);
        }}
      >
        <Text variant="smallP" sx={{fontWeight: 'regular'}}>
          {isFeaturesListOpen ? 'Hide Details' : 'See Details'}
        </Text>
        <OpenAccordionSvg
          sx={{
            g: {strokeWidth: 2},
            transform: `rotate(${isFeaturesListOpen ? 45 : 0}deg)`,
            transition: 'transform .2s linear',
          }}
        />
      </Flex>

      {isFeaturesListOpen && (
        <ul
          sx={{
            mt: '14px',
          }}
        >
          {includedFeatures.map((feature: TicketCategoryFeature) => {
            return (
              <li
                key={feature.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '17px 1fr',
                  gridColumnGap: '0.3em',
                }}
              >
                <Box
                  sx={{
                    mt: '-1px',
                  }}
                >
                  <CheckmarkSvg
                    sx={{
                      circle: {
                        fill: '#9EC28E',
                        stroke: '#9EC28E',
                      },
                      path: {
                        stroke: 'white',
                      },
                    }}
                  />
                </Box>
                <SanityRichText blocks={feature.description} />
              </li>
            );
          })}
        </ul>
      )}
    </Box>
  );
};
