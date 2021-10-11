/** @jsx jsx */
import {jsx, Box, Text, HistoryCardProps} from '@tishman/components';
import {H} from '@hzdg/sectioning';

export const DidYouKnowCard = ({
  didYouKnow,
}: Pick<HistoryCardProps, 'didYouKnow'>): JSX.Element => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        maxWidth: '300px',
        mx: 'auto',
        mt: [4, null, 6],
      }}
    >
      <H
        sx={{
          variant: 'styles.h4',
          fontFamily: 'headingSecondary',
          mb: 4,
          position: 'relative',
          '::after': {
            position: 'absolute',
            content: '""',
            height: 2,
            width: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 'calc(100% + 16px)',
            bg: 'text',
            display: 'block',
          },
        }}
      >
        Did You Know…?
      </H>
      <Text
        as="p"
        sx={{
          variant: 'text.smallP',
          fontStyle: 'italic',
        }}
      >
        {didYouKnow}
      </Text>
    </Box>
  );
};
