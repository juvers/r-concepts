/** @jsx jsx */
import {jsx, Text, Flex, Box, Link} from '@tishman/components';

export interface FooterContactProps {
  address: string;
  phoneNumberOne: string;
  phoneNumberTwo: string;
  copyright: string;
  footerContactSubNavLinks: {
    label: string;
    url: string;
  }[];
}

export const FooterContact = ({
  address,
  copyright,
  phoneNumberOne,
  phoneNumberTwo,
  footerContactSubNavLinks,
}: FooterContactProps): JSX.Element => {
  return (
    <Flex
      sx={{
        flexWrap: 'wrap',
        fontSize: 2,
        color: 'text',
        bg: 'background',
        borderTop: ['none', '2px solid #979797'],
        py: 4,
        justifyContent: 'space-between',
        flexDirection: ['column', null, null, 'row'],
        lineHeight: ['footer', 'inherit'],
      }}
    >
      <Box>
        <Flex sx={{flexDirection: ['column', 'row']}}>
          <Text>{address}</Text>
          <Text sx={{mx: [0, 3]}}>{phoneNumberOne}</Text>
          <Text>{phoneNumberTwo}</Text>
        </Flex>
      </Box>

      <Flex
        sx={{
          flexDirection: ['column', 'row'],
          flexGrow: 1,
          justifyContent: 'space-evenly',
          mt: [4, 0],
        }}
      >
        {footerContactSubNavLinks &&
          footerContactSubNavLinks.map(({label, url}) => (
            <Link key={label} href={url} variant="footer">
              {label}
            </Link>
          ))}
      </Flex>

      <Box
        sx={{
          mt: [4, 0],
        }}
      >
        <Text>{copyright}</Text>
      </Box>
    </Flex>
  );
};
