/** @jsx jsx */
import {jsx, Box, Text} from '@tishman/components';
import {useRef} from 'react';
import Img from 'gatsby-image';
import {H} from '@hzdg/sectioning';
import type {FluidObject} from 'gatsby-image';

import {useHistoryTitleLine} from './useHistoryLine';
import {DidYouKnowCard} from './DidYouKnowCard';
import {HearHistoryCard} from './HearHistoryCard';

export * from './useHistoryLine';
export * from './useRect';
export * from './useToggleHistoryCards';

export enum HISTORY_CARD_TYPES {
  PORTRAIT = 'PORTRAIT',
  LANDSCAPE = 'LANDSCAPE',
}

export interface HistoryCardProps {
  /**
   * Card type, must be one of the enums,
   * this lets the section know which component to render
   * current types are "PORTRAIT" and "LANDSCAPE"
   */
  type: HISTORY_CARD_TYPES;
  /**
   * allows for special styling depending on if
   * its on right side or left side in desktop viewport
   * this should be calculated in the mapping of history cards
   * based on the cards index
   */
  isEven: boolean;
  /** The title of the card. (also used as the key) */
  title: string;
  /** Short caption of the card */
  caption: string;
  /**
   * sectionWidth allows useHistoryTitleLine to draw the title line to
   * the section line down middle of page on desktop and left side on mobile
   */
  sectionWidth?: number;

  alt: string;

  fluid: FluidObject;

  didYouKnow?: string;
  hearHistory?: string;
}

export const HistoryCard = ({
  type,
  title,
  caption,
  fluid,
  alt,
  isEven,
  sectionWidth,
  didYouKnow,
  hearHistory,
}: HistoryCardProps): JSX.Element => {
  const titleRef = useRef(null);

  const historyTitleLine = useHistoryTitleLine(titleRef, sectionWidth);
  return (
    <Box
      key={title}
      sx={{
        ml: [isEven ? 'auto' : 0, null, 0],
        mr: [isEven ? 0 : 'auto', null, 0],
        mb: [5, null, 7],
        maxWidth: [
          type === HISTORY_CARD_TYPES.LANDSCAPE ? '65vw' : '55vw',
          type === HISTORY_CARD_TYPES.LANDSCAPE ? '55vw' : '45vw',
          type === HISTORY_CARD_TYPES.LANDSCAPE ? '400px' : '315px',
        ],
      }}
    >
      {fluid && alt && <Img sx={{mb: 4}} fluid={fluid} alt={alt} />}
      <H
        ref={titleRef}
        sx={{
          variant: 'text.mediumP',
          fontWeight: 'medium',
          position: 'relative',
          mb: 2,
          mr: [0, null, isEven ? 5 : 0],
          ...historyTitleLine,
        }}
      >
        {title}
      </H>
      <Text
        as="p"
        sx={{
          variant: 'text.smallP',
          fontStyle: 'italic',
        }}
      >
        {caption}
      </Text>
      {didYouKnow && <DidYouKnowCard didYouKnow={didYouKnow} />}
      {hearHistory && <HearHistoryCard hearHistory={hearHistory} />}
    </Box>
  );
};
