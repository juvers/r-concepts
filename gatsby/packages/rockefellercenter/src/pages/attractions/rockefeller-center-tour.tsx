/** @jsx jsx */
import {jsx, AnchorSection, SecondaryMenuBar} from '@tishman/components';
import {useMemo} from 'react';
import invariant from 'invariant';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import TourFaqBlock from '~blocks/TourFaqBlock';
import TourHeroBlock from '~blocks/TourHeroBlock';
import TourWideCtaBlock from '~blocks/TourWideCtaBlock';
import TourHistoryBlock from '~blocks/TourHistoryBlock';
import TourThreeColGridBlock from '~blocks/TourThreeColGridBlock';
import ShareYourExperienceBlock from '~blocks/ShareYourExperienceBlock';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Black',
  logo: 'Rockefeller Center Tour',
  cta: {to: '/buy-tickets/#rockefeller-center-tour', label: 'Buy Tickets'},
};

export default function RockefellerCenterTourPage({
  data: {dataJson},
}: {
  data: GatsbyTypes.RcTourPageQuery;
}): JSX.Element {
  invariant(dataJson, 'Tour JSON data is required!');

  const [artData, architectureData, pointsOfInterestData] = useMemo(() => {
    return dataJson.tourThreeColGrid.rows.map((row) => {
      return {
        gridOrder: row.gridOrder,
        textCard: {
          title: row.textCard.title,
          caption: row.textCard.caption,
        },
        imageCard: {
          fluid: row.imageCard.image.src.fluid,
          alt: row.imageCard.image.alt,
          width: row.imageCard.width,
          height: row.imageCard.height,
        },
        didYouKnowCard: {
          fluid: row.didYouKnowCard.image.src.fluid,
          alt: row.didYouKnowCard.image.alt,
          width: row.didYouKnowCard.width,
          height: row.didYouKnowCard.height,
          title: row.didYouKnowCard.title,
          caption: row.didYouKnowCard.caption,
        },
      };
    });
  }, [dataJson]);

  return (
    <Layout theme="Rock Center Black">
      <SecondaryMenuBar
        sticky
        threshold={0.5}
        title="Explore The Tour"
        cta={config.cta}
        links={[
          {url: '#history', label: 'History'},
          {url: '#art', label: 'Art'},
          {url: '#architecture', label: 'Architecture'},
          {url: '#points-of-interest', label: 'Points of Interest'},
          {url: '#faqs', label: 'FAQs'},
        ]}
      />
      <TourHeroBlock />
      <TourHistoryBlock id="history" />
      <AnchorSection id="art" pt={[5, 9]}>
        <TourThreeColGridBlock {...artData} />
      </AnchorSection>
      <AnchorSection id="architecture">
        <TourThreeColGridBlock {...architectureData} />
      </AnchorSection>
      <AnchorSection id="points-of-interest" pb={[0, 5]}>
        <TourThreeColGridBlock {...pointsOfInterestData} />
      </AnchorSection>
      <TourFaqBlock id="faqs" />
      <TourWideCtaBlock />
      <ShareYourExperienceBlock
        theme="Rock Center Cream"
        hashTags={['#rockefellercenter', '#rockcenter', '#rockefellerplaza']}
        labels={['rockefellercenter', 'rockcenter', 'rockefellerplaza']}
      />
    </Layout>
  );
}

export const query = graphql`
  query RcTourPage {
    meta: sanityAttractionRc {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
    dataJson(id: {eq: "rockefeller-center-tour"}) {
      tourThreeColGrid {
        rows {
          gridOrder
          textCard {
            title
            caption
          }
          didYouKnowCard {
            title
            caption
            height
            width
            image {
              src {
                fluid(maxWidth: 700) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
              alt
            }
          }
          imageCard {
            height
            width
            image {
              src {
                fluid(maxWidth: 700) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
              alt
            }
          }
        }
      }
    }
  }
`;
