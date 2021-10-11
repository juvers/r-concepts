/**@jsx jsx */
import {jsx, CheckmarkSvg} from '@tishman/components';
import {SanityRichText} from '@tishman/components';

import type {TicketCategoryFeature} from '../types';

interface TicketFeaturesListProps {
  allFeatures: TicketCategoryFeature[];
  includedFeatures: TicketCategoryFeature[];
}

export const TicketFeaturesList = ({
  allFeatures,
  includedFeatures,
}: TicketFeaturesListProps): JSX.Element => {
  const isFeatureIncluded = (id: string | number) => {
    return includedFeatures.find((f) => f.id === id);
  };

  return (
    <ul>
      {allFeatures.map((feature: TicketCategoryFeature) => {
        return (
          <li
            data-order={feature.order}
            key={feature.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '17px 1fr',
              gridColumnGap: '0.3em',
              mb: 3,
              mt: 3,
            }}
          >
            {isFeatureIncluded(feature.id) ? (
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
            ) : (
              <span />
            )}
            <SanityRichText blocks={feature.description} />
          </li>
        );
      })}
    </ul>
  );
};
