/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import WorkingCommunityIntroBlock from '~blocks/WorkingCommunityIntroBlock';
import WorkingCommunityFullCalloutCardBlock from '~blocks/WorkingCommunityFullCalloutCardBlock';
import WorkingCommunityCalloutCardGridBlock from '~blocks/WorkingCommunityCalloutCardGridBlock';
import WorkingCommunityFeaturedGalleryBlock from '~blocks/WorkingCommunityFeaturedGalleryBlock';
import WorkingCommunityCrossLinkBlock from '~blocks/WorkingCommunityCrossLinkBlock';
import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Navy',
  logo: 'Rockefeller Center',
  pageName: 'Our Rockefeller Center Community',
  cta: {
    to: 'https://app.findyourzo.com/login',
    label: 'ZO. LOGIN',
  },
};

export const query = graphql`
  query WorkingCommunityMeta {
    meta: dataJson(id: {eq: "working-community"}) {
      meta {
        title
        description
      }
    }
  }
`;

export default function CommunityPage(): JSX.Element {
  return (
    <Layout theme="Rock Center Navy">
      <WorkingCommunityIntroBlock
        id="working-community-intro"
        theme="Rock Center Navy"
      />
      <WorkingCommunityFullCalloutCardBlock
        id="working-community-full-callout"
        theme="Rock Center Cream"
      />
      <WorkingCommunityCalloutCardGridBlock
        id="working-community-callout-grid"
        theme="Rock Center Cream"
      />
      <WorkingCommunityFeaturedGalleryBlock
        id="working-community-featured-gallery"
        theme="Rock Center Cream"
      />
      <WorkingCommunityCrossLinkBlock
        id="working-commmunity-cross-link"
        theme="Rock Center Navy"
      />
    </Layout>
  );
}
