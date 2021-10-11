/** @jsx jsx */
import {jsx, AnchorSection, Box} from '@tishman/components';
import {BuyTicketsCarousel} from './BuyTicketsCarousel';
import {THEME_ORDER} from '../common/themeOrder';

import type {BuyTicketsProps, TicketCategory} from '../types';

export function BuyTicketsDesktop({
  allCategories,
  allFeatures,
}: BuyTicketsProps): JSX.Element {
  return (
    <Box>
      {allCategories.map((cat: TicketCategory, i: number) => {
        return (
          <AnchorSection
            key={cat.id}
            id={`${cat.titleAndSlug.slug.current}`}
            theme={THEME_ORDER[i] || 'Rock Center Black'}
            sx={{
              flexWrap: 'wrap',
              py: '71px',
              '&:first-of-type': {
                pt: '0px',
              },
              px: [3, 4],
              display: ['none', 'flex'],
            }}
          >
            <BuyTicketsCarousel
              key={cat.titleAndSlug.title}
              allFeatures={allFeatures[cat.id]}
              allCategories={allCategories}
              {...cat}
            />
          </AnchorSection>
        );
      })}
    </Box>
  );
}
