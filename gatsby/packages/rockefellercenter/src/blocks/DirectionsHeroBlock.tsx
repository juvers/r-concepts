/** @jsx jsx */
import {jsx, Section, Container, HoursAndAddress} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {getContactsInfoProps} from '~blocks/utils';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const DIRECTIONS_HERO_QUERY = graphql`
  query DirectionsHero {
    dataJson(id: {eq: "directions"}) {
      directionHero {
        title
        bodyCopy
        links {
          label
          url
        }
        location {
          address1
          address2
        }
        contactsInfo {
          type
          value
        }
        contactLinkUrl
      }
    }
  }
`;

const DirectionsHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.DirectionsHeroQuery>(
    DIRECTIONS_HERO_QUERY,
  );

  invariant(dataJson, 'Directions JSON data is required!');
  const directionsHeroProps = useMemo(() => {
    const heroText = {
      title: dataJson.directionHero.title,
      caption: dataJson.directionHero.bodyCopy,
    };

    if (!dataJson?.directionHero?.contactsInfo)
      throw new Error('Expected Directions hero contacts info');

    const contactsInfo = dataJson?.directionHero?.contactsInfo.map((contact) =>
      getContactsInfoProps(contact),
    );

    return {
      heroText,
      location: dataJson.directionHero.location,
      contactsInfo,
      links:
        dataJson.directionHero.links &&
        dataJson.directionHero.links.map((link) => link),
      contactLinkUrl: dataJson?.directionHero?.contactLinkUrl,
    };
  }, [dataJson]);

  return (
    directionsHeroProps && (
      <Section {...props}>
        <Container
          sx={{
            display: 'flex',
            flexDirection: ['column', null, 'row'],
            justifyContent: 'space-between',
            pt: [5, null, 7],
            pb: [4, 6],
          }}
        >
          <IntroText
            {...directionsHeroProps.heroText}
            links={directionsHeroProps.links}
          />
          <HoursAndAddress
            location={directionsHeroProps.location}
            contactsInfo={directionsHeroProps.contactsInfo}
            contactLinkUrl={directionsHeroProps.contactLinkUrl}
          />
        </Container>
      </Section>
    )
  );
};

export default DirectionsHeroBlock;
