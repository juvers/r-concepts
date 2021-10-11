/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {Layout} from '~layouts';
import {useMemo} from 'react';
import SpecialOffersHeroBlock from '~blocks/SpecialOffersHeroBlock';
import SpecialOffersListBlock from '~blocks/SpecialOffersListBlock';
import SpecialOffersHeroNoOffersBlock from '~blocks/SpecialOffersHeroNoOffersBlock';
import SpecialOffersWideCtaBlock from '~blocks/SpecialOffersWideCtaBlock';
import SpecialOfferCalloutGridBlock from '~blocks/SpecialOfferCalloutGridBlock';
import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  pageName: 'Special Offers',
  theme: 'Rock Center Green',
  cta: {
    to: '/buy-tickets',
    label: 'Buy Tickets',
  },
};

export const OfferLpMetaQuery = graphql`
  query OfferLpMeta {
    meta: sanityOfferLp {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
    OfferLp: sanityOfferLp {
      _rawFeaturedOffer
      _rawOffers
    }
  }
`;

const SpecialOffersPage = (): JSX.Element => {
  const {OfferLp} = useStaticQuery<GatsbyTypes.OfferLpMetaQuery>(
    OfferLpMetaQuery,
  );

  const specialOffersPageProps = useMemo(() => {
    return {
      featuredOffers: OfferLp?._rawFeaturedOffer,
      allOffers: OfferLp?._rawOffers ? OfferLp?._rawOffers : [],
    };
  }, [OfferLp]);

  const hasNoOffers =
    specialOffersPageProps?.featuredOffers === null &&
    specialOffersPageProps?.allOffers?.length === 0;

  return (
    <Layout theme="Rock Center Green">
      {hasNoOffers && <SpecialOffersHeroNoOffersBlock />}
      {specialOffersPageProps?.featuredOffers !== null && !hasNoOffers && (
        <SpecialOffersHeroBlock
          id="special-offer-hero"
          theme="Rock Center Green"
        />
      )}
      {specialOffersPageProps?.allOffers?.length !== 0 && !hasNoOffers && (
        <SpecialOffersListBlock id="special-offer-list" theme="Rock Center" />
      )}
      <SpecialOffersWideCtaBlock
        id="special-offer-wide-cta"
        theme="Rock Center"
      />
      <SpecialOfferCalloutGridBlock
        id="special-offer-callout-grid"
        theme="Rock Center"
      />
    </Layout>
  );
};

export default SpecialOffersPage;
