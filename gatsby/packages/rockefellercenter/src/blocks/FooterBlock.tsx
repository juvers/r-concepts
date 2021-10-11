/** @jsx jsx */
import {jsx, Section, Footer} from '@tishman/components';
import {memo, useMemo} from 'react';
import invariant from 'invariant';
import {useStaticQuery, graphql} from 'gatsby';
import {useMenuLinkGroups} from '~blocks/queries';

import type {ComponentPropsWithoutRef} from 'react';
import type {MenuLink} from '~blocks/queries';

const FOOTER_QUERY = graphql`
  query Footer {
    footerLogo: image(relativePath: {eq: "tishman-logo.png"}) {
      fixed(width: 88, height: 46) {
        ...GatsbyImageSharpFixed_withWebp
      }
    }
    dataJson(id: {eq: "footer"}) {
      footerAppDownloadData {
        appStore {
          link
          image {
            fluid {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        googlePlay {
          link
          image {
            fluid {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
      footerContactData {
        address
        copyright
        phoneNumberOne
        phoneNumberTwo
      }
      footerFollowUsData {
        facebook
        instagram
        rocklistUrl
        twitter
      }
      subNavLinks {
        label
        url
      }
      footerContactSubNavLinks {
        label
        url
      }
    }
  }
`;

const FooterBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {menuLinkGroups} = useMenuLinkGroups();
  const {footerLogo, dataJson} = useStaticQuery<GatsbyTypes.FooterQuery>(
    FOOTER_QUERY,
  );
  invariant(footerLogo, 'Footer logo is required!');
  invariant(dataJson, 'Footer JSON data is required!');

  const footerLogoData = useMemo(() => {
    return {
      logo: footerLogo.fixed,
      appStore: {
        link: dataJson.footerAppDownloadData.appStore.link,
        image: dataJson.footerAppDownloadData.appStore.image.fluid,
      },
      googlePlay: {
        link: dataJson.footerAppDownloadData.googlePlay.link,
        image: dataJson.footerAppDownloadData.googlePlay.image.fluid,
      },
    };
  }, [dataJson, footerLogo]);

  return (
    <Section
      {...props}
      theme="Rock Center Black"
      sx={{
        '@media print': {
          display: 'none',
        },
      }}
    >
      <Footer
        menuLinks={menuLinkGroups}
        links={dataJson.subNavLinks as MenuLink[]}
        {...footerLogoData}
        {...dataJson.footerContactData}
        footerContactSubNavLinks={
          dataJson.footerContactSubNavLinks as MenuLink[]
        }
        {...dataJson.footerFollowUsData}
      />
    </Section>
  );
};

export default memo(FooterBlock);
