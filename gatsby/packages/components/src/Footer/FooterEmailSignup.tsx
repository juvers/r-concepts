/**@jsx jsx */
import {jsx, Text, Link, Box} from '@tishman/components';

export interface FooterEmailSignupProps {
  rocklistUrl: string;
}

export const FooterEmailSignup = ({
  rocklistUrl,
}: FooterEmailSignupProps): JSX.Element => {
  return (
    <Box
      sx={{
        width: ['100%', 'unset'],
        mb: [4, null, null, 0],
      }}
    >
      <Text variant="footerHeading">Sign up for our newsletter</Text>
      <Link to={rocklistUrl} variant="footerButton">
        Subscribe Now
      </Link>
    </Box>
  );
};
