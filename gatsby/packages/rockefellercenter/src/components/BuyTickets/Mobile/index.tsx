/** @jsx jsx */
import {
  jsx,
  Section,
  AnchorSection,
  Box,
  SanityRichText,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {CategoryChooser} from './CategoryChooser';
import {MobileTicketCard} from './MobileTicketCard';
import {THEME_ORDER} from '../common/themeOrder';

import type {BuyTicketsProps} from '../types';

export function BuyTicketsMobile({
  allCategories,
}: BuyTicketsProps): JSX.Element {
  return (
    <Section
      data-mobile="true"
      sx={{
        display: ['block', 'none'],
      }}
    >
      <Section sx={{px: [3, 4]}}>
        <CategoryChooser categories={allCategories} />
      </Section>

      {allCategories.map((cat, i) => {
        return (
          <AnchorSection
            key={cat.id}
            id={`${cat.titleAndSlug.slug.current}`}
            theme={THEME_ORDER[i] || 'Rock Center Black'}
            sx={{
              pt: i > 0 ? '56px' : '0px',
              pb: '36px',
              px: [3, 4],
            }}
          >
            <H
              sx={{
                variant: 'styles.h2',
                mb: '12px',
                fontFamily: 'headingSecondary',
              }}
            >
              {cat.titleAndSlug.title}
            </H>

            <Box
              sx={{
                mb: '28px',
                p: {
                  mb: '0px',
                },
              }}
            >
              <SanityRichText blocks={cat.description} />
            </Box>

            {cat.tickets.map((ticket) => {
              return <MobileTicketCard key={ticket.id} {...ticket} />;
            })}
          </AnchorSection>
        );
      })}
    </Section>
  );
}
