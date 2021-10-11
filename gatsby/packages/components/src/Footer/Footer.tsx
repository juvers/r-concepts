/** @jsx jsx */
import {jsx, Flex, Container, IntrinsicBox} from '@tishman/components';
import {
  FooterMenu,
  FooterSubNav,
  FooterContact,
  FooterFollowUs,
  FooterMenuProps,
  FooterSubNavProps,
  FooterEmailSignup,
  FooterAppDownload,
  FooterContactProps,
  FooterFollowUsProps,
  FooterAppDownloadProps,
  FooterEmailSignupProps,
} from './index';

export type FooterProps = FooterSubNavProps &
  FooterContactProps &
  FooterFollowUsProps &
  FooterAppDownloadProps &
  FooterEmailSignupProps &
  FooterMenuProps;

export function Footer({
  links,
  address,
  twitter,
  facebook,
  instagram,
  copyright,
  phoneNumberOne,
  phoneNumberTwo,
  footerContactSubNavLinks,
  logo,
  appStore,
  googlePlay,
  rocklistUrl,
  menuLinks,
}: FooterProps): JSX.Element {
  return (
    <IntrinsicBox ratio={16 / 1} sx={{bg: 'background'}}>
      <Container sx={{maxWidth: 1400}}>
        <Flex
          sx={{
            pt: [4, 6],
            alignItems: 'baseline',
            flexWrap: ['nowrap', 'wrap'],
            flexDirection: ['column', 'row'],
            justifyContent: 'space-between',
          }}
        >
          <FooterEmailSignup rocklistUrl={rocklistUrl} />
          <FooterFollowUs
            twitter={twitter}
            facebook={facebook}
            instagram={instagram}
          />
          <FooterAppDownload appStore={appStore} googlePlay={googlePlay} />
        </Flex>
        <FooterMenu menuLinks={menuLinks} />
        <FooterSubNav links={links} logo={logo} />
        <FooterContact
          address={address}
          copyright={copyright}
          phoneNumberOne={phoneNumberOne}
          phoneNumberTwo={phoneNumberTwo}
          footerContactSubNavLinks={footerContactSubNavLinks}
        />
      </Container>
    </IntrinsicBox>
  );
}
