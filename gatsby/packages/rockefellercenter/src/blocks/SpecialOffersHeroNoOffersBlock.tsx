/**@jsx jsx */
import {jsx, Text, Box} from '@tishman/components';

const SpecialOffersHeroNoOffersBlock = (): JSX.Element => {
  return (
    <Box sx={{padding: ['30px 15px', '70px 50px', 145]}}>
      <Text
        sx={{
          fontSize: [24, 30],
          fontWeight: 400,
          lineHeight: ['36px'],
          maxWidth: [730],
          margin: ['0 auto'],
          textAlign: 'center',
        }}
      >
        We&apos;re sorry, there are no special offers at this time. Sign up for
        The Center Newsletter below to have all future special offers delivered
        to your inbox.
      </Text>
    </Box>
  );
};

export default SpecialOffersHeroNoOffersBlock;
