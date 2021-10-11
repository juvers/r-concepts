/**@jsx jsx */
import {jsx, CheckmarkSvg} from '@tishman/components';
import type {
  TicketFeatures,
  TicketFeaturesDescriptions,
} from './TicketComparisonTool';

interface TicketFeaturesListProps {
  featureList: TicketFeaturesDescriptions;
  ticketTitle: string;
  ticketFeatures: TicketFeatures;
}

export const TicketFeaturesList = ({
  featureList,
  ticketTitle,
  ticketFeatures,
}: TicketFeaturesListProps): JSX.Element => {
  const keys = Object.keys(featureList);
  return (
    <ul>
      {keys.map((key) => {
        if (ticketFeatures[key]) {
          return (
            <li
              key={`${ticketTitle} - ${String(ticketFeatures[key])}`}
              sx={{
                display: 'grid',
                gridTemplateColumns: '17px 1fr',
                gridColumnGap: '0.3em',
                mb: 3,
              }}
            >
              <CheckmarkSvg aria-hidden /> {featureList[key]}
            </li>
          );
        } else {
          return (
            <li
              key={`${ticketTitle} - ${featureList[key]}`}
              sx={{
                display: 'grid',
                gridTemplateColumns: '17px 1fr',
                gridColumnGap: '0.3em',
                mb: 3,
                opacity: 0.5,
              }}
            >
              <CheckmarkSvg aria-hidden sx={{visibility: 'hidden'}} />{' '}
              {featureList[key]}
            </li>
          );
        }
      })}
    </ul>
  );
};
