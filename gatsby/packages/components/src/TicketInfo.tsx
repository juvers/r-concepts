/**@jsx jsx */
import {
  jsx,
  Grid,
  Box,
  Text,
  HiddenFeesSvg,
  TimeSvg,
  ReIssueSvg,
  UmbrellaSvg,
  Container,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import * as colors from './themes/colors';

export interface TicketInfoProps {
  items: TicketInfoItemProps[];
}

export interface TicketInfoItemProps {
  title: string;
  copy: string;
  icon: string;
}

export const TicketInfo = ({items}: TicketInfoProps): JSX.Element => {
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'time':
        return <TimeSvg sx={{color: colors.YELLOW}} />;
      case 'umbrella':
        return <UmbrellaSvg sx={{color: colors.BLUE}} />;
      case 'issue':
        return <ReIssueSvg sx={{color: colors.LAVENDER}} />;
      case 'hidden':
        return <HiddenFeesSvg sx={{color: colors.OLIVE}} />;
    }
  };

  return (
    <Container sx={{py: [3, 4], bg: colors.WHITE}}>
      <Grid
        sx={{
          px: [0, 5],
          gridGap: 5,
          gridTemplateColumns: [
            'repeat(1, 1fr)',
            'repeat(2, 1fr)',
            'repeat(4, 1fr)',
          ],
        }}
      >
        {items.map(({title, copy, icon}) => (
          <Box key={title} sx={{textAlign: ['center', null, 'left']}}>
            {getIcon(icon)}
            <H
              sx={{
                variant: 'styles.h3',
                fontSize: 5,
                fontFamily: 'headingSecondary',
                mt: 3,
                color: colors.BLACK,
              }}
            >
              {title}
            </H>
            <Text sx={{color: colors.BLACK}}>{copy}</Text>
          </Box>
        ))}
      </Grid>
    </Container>
  );
};
