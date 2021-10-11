/** @jsx jsx */
import {
  jsx,
  Text,
  Grid,
  Flex,
  Box,
  ArrowLink,
  Sticky,
  useStickyState,
} from '@tishman/components';
import type {GridProps} from '@tishman/components';
import {useContext} from 'react';
import {TimeContext, padTime} from '~components/BuyTickets';
const BuyTicketsBarColumn = ({
  children,
  sx,
  ...props
}: Omit<GridProps, 'ref'>) => (
  <Grid
    gap={2}
    sx={{
      flexShrink: 0,
      gridAutoFlow: 'column',
      gridAutoColumns: 'max-content',
      alignItems: 'center',
      transform: 'translate3d(0,0,0)',
      minHeight: '69px',
      ...sx,
    }}
    {...props}
  >
    {children}
  </Grid>
);

export interface BuyTicketsBarProps {
  sticky?: boolean;
  title: string;
  price: number;
  tax: number;
  isRunning: boolean;
  showPrice?: boolean;
}

const BuyTicketsBarContent = ({
  title,
  price,
  tax,
  isRunning,
  showPrice,
}: BuyTicketsBarProps) => {
  const timeValue = useContext(TimeContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const minutes: any = padTime(Math.floor(timeValue / 60));
  const seconds = padTime(timeValue - minutes * 60);
  const isSticky = useStickyState();

  return (
    <Flex
      sx={{
        maxWidth: isSticky ? 'inherit' : 'container',
        mx: 'auto',
        px: isSticky ? [3, null, 4] : [0, null, 3],
        height: ['filterBarMobile', null, 'filterBar'],
        justifyContent: isSticky
          ? 'space-between'
          : ['stretch', null, 'center'],
        bg: isSticky ? 'background' : 'none',
        transform: 'translate3d(0,0,0)',
      }}
    >
      <BuyTicketsBarColumn
        sx={{
          opacity: isSticky ? 1 : 0,
          display: ['none', null, 'inherit'],
        }}
      >
        <ArrowLink href="/buy-tickets/" reverse label="BACK" />
      </BuyTicketsBarColumn>
      <BuyTicketsBarColumn
        sx={{
          opacity: isSticky ? 1 : 0,
        }}
      >
        <Text variant="buyTicketsBarTitle">{title}</Text>
      </BuyTicketsBarColumn>
      <BuyTicketsBarColumn
        sx={{
          justifySelf: 'end',
          opacity: isSticky ? 1 : 0,
        }}
      >
        <Box sx={{textAlign: 'right'}}>
          <Flex sx={{alignItems: 'center'}}>
            {isRunning && (
              <Text sx={{fontSize: 1, mr: [2, 3], width: ['auto', 157]}}>
                <span sx={{fontWeight: 'bold'}}>
                  {minutes} : {seconds}
                </span>{' '}
                <span sx={{display: ['none', 'inline']}}>
                  min left to complete your transaction
                </span>
              </Text>
            )}
            {showPrice && (
              <Box>
                <Text variant="ticketsPriceSticky">${price}</Text>
                {tax && (
                  <Text sx={{variant: 'text.taxHeadingSticky'}}>
                    +${tax} Tax
                  </Text>
                )}
              </Box>
            )}
          </Flex>
        </Box>
      </BuyTicketsBarColumn>
    </Flex>
  );
};

export function BuyTicketsBar(props: BuyTicketsBarProps): JSX.Element {
  return (
    <Sticky
      top="auto"
      sx={{
        WebkitBackfaceVisibility: 'hidden',
        WebkitTransformStyle: 'preserve-3d',
      }}
    >
      <BuyTicketsBarContent {...props} />
      <Box mb={[-7, null, -6]} />
    </Sticky>
  );
}
