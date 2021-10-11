/**@jsx jsx */
import {jsx, Link, Flex, Box, Text} from '@tishman/components';

export interface FooterMenuProps {
  /**
   * Displays a list of links in a footer menu.
   * @param {Object[]} menuLinks - list of menu link groups
   * @param {string} menuLinks[].label - group label
   * @param {string} menuLinks[].url - url to group landing page
   * @param {string} menuLinks[].links[LinkProp] - list of objects that have
   * a label and "url" url.
   */
  menuLinks: {
    label: string;
    url?: string;
    links: LinkProp[];
  }[];
}

interface LinkProp {
  label: string;
  url: string;
}

export const FooterMenu = ({menuLinks}: FooterMenuProps): JSX.Element => (
  <Flex
    sx={{
      pt: [4, 6],
      mt: [5, 7],
      justifyContent: 'space-between',
      borderTop: '1px solid #979797',
      flexDirection: ['column', 'column', 'row'],
    }}
  >
    {menuLinks.map(({label, links}) => (
      <Box key={label} sx={{mb: 4}}>
        <Text variant="footerHeading">{label}</Text>
        {links.map(({label, url}) => (
          <Box key={label}>
            <Link
              to={url}
              variant="footer"
              sx={{
                fontWeight: 'medium',
                fontSize: [2, 3],
                lineHeight: 'footer',
              }}
            >
              {label}
            </Link>
          </Box>
        ))}
      </Box>
    ))}
  </Flex>
);
