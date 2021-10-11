/**@jsx jsx */
import {jsx, Container, ArrowLink, TabMenu, Section} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {useNavigate, useLocation} from '@reach/router';
import {useEffect, useState} from 'react';
import type {TishmanThemeName} from '@tishman/components';

interface RockGroupSalesHeroProps {
  title: string;
  backLink: {
    label: string;
    url: string;
  };
  tabs: {
    label: string;
    slug: string;
  }[];
  theme?: TishmanThemeName;
  id?: string;
  initialHash: string;
}

const RockGroupSalesHeroBlock = ({
  title,
  backLink,
  theme,
  id,
  tabs,
  initialHash,
}: RockGroupSalesHeroProps): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() =>
    tabs.findIndex(({slug}) => {
      if (!location.hash) return slug === initialHash;
      return slug === location.hash;
    }),
  );

  useEffect(() => {
    if (!location.hash) navigate(initialHash, {replace: true});
    setActiveTab(
      tabs.findIndex(({slug}) => {
        return slug === location.hash;
      }),
    );
  }, [location.hash, initialHash, navigate, tabs]);

  return (
    <Section theme={theme} id={id}>
      <Container sx={{maxWidth: 987}}>
        <ArrowLink reverse href={backLink.url} label={backLink.label} />
        <H
          sx={{
            variant: 'styles.h1',
            fontFamily: 'headingSecondary',
            py: 4,
          }}
        >
          {title}
        </H>
        <TabMenu
          tab={activeTab}
          labels={tabs.map(({label}) => label)}
          onTabChange={async (index) => {
            await navigate(encodeURI(tabs[index].slug));
          }}
          sx={{borderColor: 'background'}}
          tabColor="primary"
          tabHeight={4}
        />
      </Container>
    </Section>
  );
};

export default RockGroupSalesHeroBlock;
