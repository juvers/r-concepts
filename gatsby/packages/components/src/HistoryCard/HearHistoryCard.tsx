/** @jsx jsx */
import {
  jsx,
  Box,
  Flex,
  Text,
  VolumeSvg,
  HistoryCardProps,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';

export const HearHistoryCard = ({
  hearHistory,
}: Pick<HistoryCardProps, 'hearHistory'>): JSX.Element => {
  return (
    <Box
      sx={{
        textAlign: ['center', null, 'left'],
        maxWidth: '300px',
        mx: 'auto',
        mt: [4, null, 6],
      }}
    >
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          mb: 3,
        }}
      >
        <VolumeSvg sx={{mr: 3}} />
        <H
          sx={{
            variant: 'styles.h4',
            fontFamily: 'headingSecondary',
            mb: 0,
          }}
        >
          Hear History
        </H>
      </Flex>
      <Text
        as="p"
        sx={{
          variant: 'text.smallP',
          fontStyle: 'italic',
        }}
      >
        {hearHistory}
      </Text>
    </Box>
  );
};
