/** @jsx jsx */
import {
  jsx,
  Box,
  Text,
  Flex,
  Link,
  FaceBookIconSvg,
  InstagramIconSvg,
  TwitterIconSvg,
} from '@tishman/components';

export interface FooterFollowUsProps {
  facebook: string;
  instagram: string;
  twitter: string;
}

const iconStyles = {
  display: 'inline-block',
  width: [50, 72],
  color: 'text',
  ':hover': {
    color: 'primary',
  },
};

export const FooterFollowUs = ({
  facebook,
  twitter,
  instagram,
}: FooterFollowUsProps): JSX.Element => (
  <Flex sx={{flexDirection: 'column', justifyContent: 'space-between'}}>
    <Text variant="footerHeading">Follow Us</Text>
    <Box>
      <Link
        href={facebook}
        sx={iconStyles}
        target="_blank"
        aria-label={'Follow us on Facebook'}
      >
        <FaceBookIconSvg width="100%" height="100%" />
      </Link>
      <Link
        href={twitter}
        sx={{...iconStyles, mx: 3}}
        target="_blank"
        aria-label={'Follow us on Twitter'}
      >
        <TwitterIconSvg width="100%" height="100%" />
      </Link>
      <Link
        href={instagram}
        sx={iconStyles}
        target="_blank"
        aria-label={'Follow us on Instagram'}
      >
        <InstagramIconSvg width="100%" height="100%" />
      </Link>
    </Box>
  </Flex>
);
