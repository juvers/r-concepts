/** @jsx jsx */
import {jsx} from '@tishman/components';
import {Layout} from '~layouts';

import RockGroupSalesHeroBlock from '~blocks/RockGroupSalesHeroBlock';
import RockGroupSalesTabMenuBlock from '~blocks/RockGroupSalesTabMenuBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Top of the Rock Blue',
  pageName: null,
  logo: 'Top of the Rock',
  cta: {to: '/buy-tickets', label: 'Buy Tickets'},
};

const RockGroupSalesSection = (): JSX.Element => {
  return (
    <Layout theme="Top of the Rock">
      <RockGroupSalesHeroBlock
        id="rock-group-sales-hero"
        theme="Top of the Rock Blue"
        title="Top of the Rock Group Sales"
        backLink={{
          url: '/attractions/top-of-the-rock-observation-deck',
          label: 'Back to Top of the Rock',
        }}
        tabs={[
          {label: 'General', slug: '#general'},
          {label: 'Travel Professionals', slug: '#travel-professionals'},
          {label: 'Student Groups', slug: '#student-groups'},
          {label: 'Corporate Groups', slug: '#corporate-groups'},
        ]}
        initialHash="#general"
      />
      <RockGroupSalesTabMenuBlock />
    </Layout>
  );
};

export default RockGroupSalesSection;
