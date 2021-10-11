/**@jsx jsx */
import {jsx, Container, TabMenu, Section} from '@tishman/components';
import {useNavigate, useLocation} from '@reach/router';
import {useEffect, useState} from 'react';
import type {TishmanThemeName} from '@tishman/components';

interface MapDirectionsHeroProps {
  tabs: readonly {
    label: string;
    slug: string;
  }[];
  theme?: TishmanThemeName;
  id?: string;
  initialHash: string;
}

const MapDirectionsHeroBlock = ({
  theme,
  id,
  tabs,
  initialHash,
}: MapDirectionsHeroProps): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() =>
    tabs.findIndex(({slug}) => {
      if (!location.hash) return slug === initialHash;
      return slug === location.hash;
    }),
  );

  useEffect(() => {
    if (!location.hash) navigate(initialHash);
    setActiveTab(
      tabs.findIndex(({slug}) => {
        return slug === location.hash;
      }),
    );
  }, [location.hash, initialHash, navigate, tabs]);

  return (
    <Section theme={theme} id={id}>
      <Container sx={{maxWidth: 500, mt: [3, 4]}}>
        <TabMenu
          tab={activeTab}
          labels={tabs.map(({label}) => label)}
          onTabChange={async (index) => {
            await navigate(encodeURI(tabs[index].slug));
          }}
          sx={{
            borderColor: 'background',
          }}
          tabHeight={4}
        />
      </Container>
    </Section>
  );
};

export default MapDirectionsHeroBlock;
