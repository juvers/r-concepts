/** @jsx jsx */
import {jsx, SecondaryMenuBar} from '@tishman/components';
import GessoHeroBlock from '~blocks/GessoHeroBlock';
import GessoSelfGuidedAudioTourCalloutGridBlock from '~blocks/GessoSelfGuidedAudioTourCalloutGridBlock';
import GessoFeaturedStoriesBlock from '~blocks/GessoFeaturedStoriesBlock';
import GessoCrossLinkCrossLinkBlock from '~blocks/GessoCrossLinkBlock';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  pageName: 'Self-Guided Audio Tour of Rockefeller Center',
  cta: {
    to: '/buy-tickets',
    label: 'Buy Tickets',
  },
};

export const GessoMetaQuery = graphql`
  query gessoMeta {
    meta: sanityGessoAudioTour {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
  }
`;

const AudioTour = (): JSX.Element => {
  return (
    <Layout>
      <SecondaryMenuBar
        sticky
        threshold={0.5}
        title="Explore Audio Tour"
        links={[
          {url: '#self-guided-audio-tour', label: 'SELF-GUIDED AUDIO TOUR'},
          {url: '#redevelopment-and-retail', label: 'REDEVELOPMENT & RETAIL'},
        ]}
      />
      <GessoHeroBlock />
      <GessoSelfGuidedAudioTourCalloutGridBlock theme="Rock Center Cream" />
      <GessoFeaturedStoriesBlock theme="Rock Center Green" />
      <GessoCrossLinkCrossLinkBlock />
    </Layout>
  );
};

export default AudioTour;
