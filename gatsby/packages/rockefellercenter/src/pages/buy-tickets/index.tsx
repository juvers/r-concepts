/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {BuyTicketsApp} from '~components/BuyTickets/BuyTicketsApp';
import {Layout} from '~layouts';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center',
  logo: 'Rockefeller Center',
};

export const query = graphql`
  query BuyTicketsMeta {
    meta: dataJson(id: {eq: "buy-tickets"}) {
      meta {
        title
        description
      }
    }
  }
`;

export default function BuyTickets(): JSX.Element {
  return (
    <Layout>
      <BuyTicketsApp />
    </Layout>
  );
}
