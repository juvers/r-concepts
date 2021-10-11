/**@jsx jsx */
import {useEffect} from 'react';
import {
  Box,
  Button,
  jsx,
  FaqItem,
  SanityRichText,
  usePagination,
} from '@tishman/components';

import type {Block} from '@sanity/block-content-to-react';

const PAGE_SIZE = 6;

const countPages = (faqs: unknown[]) =>
  Math.max(1, Math.floor(faqs.length / PAGE_SIZE));

const getPageOffset = (page: number) => (page + 1) * PAGE_SIZE;
interface FaqsProps {
  /**
   * Displays a list of faq items.
   * @param {SanityRichTextProps} faqs - list of faq items
   */
  faqs: Block[];
}

export const FaqContainer = ({faqs}: FaqsProps): JSX.Element | null => {
  const {page, goto, hasNext, setPages} = usePagination({
    pages: countPages(faqs),
  });
  useEffect(() => setPages(countPages(faqs)), [setPages, faqs]);
  const itemList = hasNext ? faqs.slice(0, getPageOffset(page)) : faqs;
  return (
    <Box sx={{maxWidth: '100%', width: '100%', mr: [0, 4], mb: [5, 4, 0]}}>
      {itemList.map(({answer, question, place, description}) => {
        // format to return as item
        // - answer/question will return FAQ item
        // -  place/description will return Direction item
        const lead = question || place;
        const response = answer || description;
        return (
          <FaqItem key={lead as string} question={lead as string}>
            <SanityRichText blocks={response as Block[]} />
          </FaqItem>
        );
      })}
      {hasNext && (
        <Button sx={{width: ['100%', 'initial'], mt: 4}} onClick={goto.next}>
          Load More
        </Button>
      )}
    </Box>
  );
};
