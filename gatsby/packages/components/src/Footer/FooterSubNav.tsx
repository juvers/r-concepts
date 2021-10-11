/** @jsx jsx */
import Img, {FixedObject} from 'gatsby-image';
import {jsx, Flex, Box, Link} from '@tishman/components';

export interface FooterSubNavProps {
  /**
   * Displays a list of links in a footer subnav.
   * @param {Object[]} links - list of sub nav links
   * @param {string} links[].label - display text of link
   * @param {string} links[].url - url link
   * @param {string} links[].[target] - determines if link should open
   * a new window
   */
  links: {
    label: string;
    url: string;
    target?: string;
  }[];
  logo: FixedObject;
}

export const FooterSubNav = ({links, logo}: FooterSubNavProps): JSX.Element => {
  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        alignItems: ['start', 'center'],
        mb: [0, 3],
        mt: [3, 4],
        bg: 'background',
        flexDirection: ['column', 'row'],
        lineHeight: ['footer', 'inherit'],
      }}
    >
      <Box sx={{flex: [1, 0.9]}}>
        <Flex
          sx={{
            flexDirection: ['column', null, 'row'],
            flexWrap: ['nowrap', null, 'wrap'],
            justifyContent: 'space-between',
          }}
        >
          <Flex
            sx={{
              flexDirection: ['column', 'row'],
              justifyContent: 'space-between',
              flex: '1 0 auto',
              mr: 3,
            }}
          >
            {links &&
              links.map(({label, url, target}) => (
                <Link key={label} href={url} target={target} variant="footer">
                  {label}
                </Link>
              ))}
          </Flex>
          {/* <Flex
            sx={{
              flexDirection: ['column', 'row'],
              justifyContent: 'space-between',
              flex: '1 0 auto',
            }}
          >
            {links &&
              links.slice(5).map(({label, url, target}) => (
                <Link key={label} href={url} target={target} variant="footer">
                  {label}
                </Link>
              ))}
          </Flex> */}
        </Flex>
      </Box>
      <Box sx={{mt: 4}}>
        <Img fixed={logo} alt={'Tishman Speyer'} />
      </Box>
    </Flex>
  );
};
