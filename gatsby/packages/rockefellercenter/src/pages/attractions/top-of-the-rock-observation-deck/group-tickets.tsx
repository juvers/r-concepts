/** @jsx jsx */
import {jsx, Box} from '@tishman/components';
import {Layout} from '~layouts';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Top of the Rock Blue',
  logo: 'Observation Deck',
  cta: {
    to: '/buy-tickets#top-of-the-rock-observation-deck',
    label: 'Buy Tickets',
  },
};

export default function GroupTicketsPage(): JSX.Element {
  return (
    <Layout theme="Top of the Rock Blue">
      <Box />
    </Layout>
  );
}
