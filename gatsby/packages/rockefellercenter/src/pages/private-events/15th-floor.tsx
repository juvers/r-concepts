/** @jsx jsx */
import {jsx, Box} from '@tishman/components';
import {Layout} from '~layouts';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Black',
  pageName: null,
  cta: {to: '/plan-an-event', label: 'Plan an Event'},
};

export default function FifteenthFloorPage(): JSX.Element {
  return (
    <Layout theme="Rock Center Black">
      <Box />
    </Layout>
  );
}
