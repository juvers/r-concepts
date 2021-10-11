/** @jsx jsx */
import {jsx} from '@tishman/components';
import {Layout} from '~layouts';
import {useEffect} from 'react';
import {graphql} from 'gatsby';
import {useLocation, useNavigate} from '@reach/router';
import MapDirectionsHeroBlock from '~blocks/MapDirectionsHeroBlock';
import MapDirectionsTabMenuBlock from '~blocks/MapDirectionsTabMenuBlock';
import type {PageConfig} from '~PageConfig';
import invariant from 'invariant';

export const config: PageConfig = {
  theme: 'Rock Center Black',
  pageName: 'Directions & Map',
  cta: {to: '/buy-tickets', label: 'Buy Tickets'},
};

export const query = graphql`
  query MapDirections {
    meta: dataJson(id: {eq: "directions"}) {
      meta {
        title
        description
      }
    }
    dataJson(id: {eq: "directions"}) {
      subNavigationTabs {
        label
        slug
      }
    }
  }
`;

export default function DirectionsAndMapPage({
  data: {dataJson},
}: {
  data: GatsbyTypes.MapDirectionsQuery;
}): JSX.Element {
  invariant(dataJson, 'Directions data is required');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.hash) {
      navigate('#directions', {
        replace: true,
      });
    }
  }, [location.hash, navigate]);

  return (
    <Layout theme="Rock Center">
      <MapDirectionsHeroBlock
        theme="Rock Center Black"
        tabs={dataJson.subNavigationTabs}
        initialHash="#directions"
      />
      <MapDirectionsTabMenuBlock initialHash="#directions" />
    </Layout>
  );
}
