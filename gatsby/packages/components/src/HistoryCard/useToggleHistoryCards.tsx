import {useState, useEffect, useCallback, useMemo, RefObject} from 'react';
import {HistoryCardProps, useScrollTo} from '@tishman/components';

type LoadMoreCards = {
  /**
   * showAllCards = if there are more cards to show
   */
  showAllCards: boolean;
  /**
   * cardsToShow = design requested initially to show only 3 image cards
   *
   * if there are more than 3, set loadMore to true and set cardsToShow
   *
   * to only include the three image cards
   */
  cardsToShow: HistoryCardProps[];
  /**
   * toggleShowMore = function for load more button.
   *
   * onClick toggle cards to show
   */
  toggleShowAllCards: () => void;
};

interface ToggleHistoryCardsProps {
  allCards: HistoryCardProps[] | undefined;
  initialCardsToShow: number;
  scrollToRef: RefObject<HTMLElement>;
}

/**
 * Use Toggle History cards
 *
 * This hook allows us to initially hide some of the history data, if more
 * data is provided.
 *
 * Design requested to initially show only 3 image cards
 *
 * If section has more than 3 image cards, we want to show a Show More button
 *
 * with an onClick handler that will set showAllCards to true, and display the rest
 *
 * of the history cards as well as a close button that toggles back to initial state
 *
 * @param {HistoryCardProps[]} cards - Array of all history cards
 * @param {number} initialCardsToShow - Number of image cards to show on load
 * @return {boolean} showAllCards - if there are more cards to show
 * @return {HistoryCardProps[]} cardsToShow - array of cards to show
 * @return {function} toggleShowMore - function for toggle showAllCards onClick.
 */

export const useToggleHistoryCards = ({
  allCards,
  initialCardsToShow = 3,
  scrollToRef,
}: ToggleHistoryCardsProps): LoadMoreCards => {
  const [cardsToShow, setCardsToShow] = useState<HistoryCardProps[]>([]);
  const [showAllCards, setShowAllCards] = useState<boolean>(false);

  const initialHistoryCardsToShow = useMemo<HistoryCardProps[]>(() => {
    return allCards ? allCards.slice(0, initialCardsToShow) : [];
  }, [allCards, initialCardsToShow]);

  const scrollTo = useScrollTo({
    forceAnimation: true,
    config: {mass: 1, tension: 300, friction: 70},
  });

  useEffect(() => {
    setCardsToShow(showAllCards ? allCards ?? [] : initialHistoryCardsToShow);
  }, [allCards, initialHistoryCardsToShow, showAllCards]);

  const toggleShowAllCards = useCallback(() => {
    setShowAllCards(!showAllCards);
    if (showAllCards) {
      scrollTo(scrollToRef);
    }
  }, [showAllCards, scrollTo, scrollToRef]);

  return {cardsToShow, showAllCards, toggleShowAllCards};
};
