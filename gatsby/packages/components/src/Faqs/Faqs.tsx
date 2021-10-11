/**@jsx jsx */
import {
  jsx,
  Box,
  TabMenu,
  FaqContainer,
  usePagination,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';

import type {Block} from '@sanity/block-content-to-react';

export interface FaqsProps {
  /**
   * Faqs component takes a title, list of categories, and Sanity _rawFaqs
   * @param {string} title - title of faq section
   * @param {object[]} categories - array of category titles
   * @param {string} categories[].category - category title
   * @param {object[]} faqs - _rawFaqs or _rawDirections object from sanity
   */
  title?: string;
  categories?: {category: string}[];
  faqs: Block[];
}

export const Faqs = ({
  title,
  categories,
  faqs = [],
}: FaqsProps): JSX.Element => {
  const {page = 0, goto} = usePagination({pages: categories?.length});
  const items =
    'faqs' in faqs[page]
      ? faqs[page].faqs
      : 'directions' in faqs[page]
      ? faqs[page].directions
      : [];
  return (
    <Box sx={{flex: '1 1 auto', mr: [0, null, 7]}}>
      {title && (
        <H sx={{variant: 'styles.h1', mb: 4, fontFamily: 'headingSecondary'}}>
          {title}
        </H>
      )}
      {categories && (
        <TabMenu
          tab={page}
          labels={categories.map(({category}) => category)}
          onTabChange={goto}
        />
      )}
      {faqs && <FaqContainer faqs={items as Block[]} />}
    </Box>
  );
};
