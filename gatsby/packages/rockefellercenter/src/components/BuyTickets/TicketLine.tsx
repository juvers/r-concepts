/**@jsx jsx */
import {jsx, Box, Text, Flex} from '@tishman/components';

interface TicketLineProps {
  ticketTypeId: number;
  label: string;
  price: number;
  ticketCount: number;
  hideLabel?: boolean;
  increaseQuantity: (ticketCount: number, ticketTypeId: number) => void;
  decreaseQuantity: (ticketCount: number, ticketTypeId: number) => void;
}

export const TicketLine = ({
  increaseQuantity,
  decreaseQuantity,
  label,
  price,
  ticketCount,
  ticketTypeId,
  hideLabel,
}: TicketLineProps): JSX.Element => {
  const handleIncrease = () => {
    increaseQuantity(ticketCount, ticketTypeId);
  };
  const handleDecrease = () => {
    decreaseQuantity(ticketCount, ticketTypeId);
  };

  return (
    <Flex
      sx={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: hideLabel ? 'center' : 'space-between',
        width: '100%',
        mb: [3, 0],
        alignItems: 'baseline',
      }}
    >
      {hideLabel ? null : (
        <Flex
          sx={{
            width: '50%',
            alignItems: 'baseline',
            mb: 3,
          }}
        >
          <Text variant="ticketsHeading">{label}</Text>
          <Text
            sx={{
              variant: 'text.ticketsPriceSmall',
              marginLeft: '0.5em',
              fontWeight: 500,
            }}
          >
            ${price}
          </Text>
        </Flex>
      )}
      <Flex sx={{alignItems: 'center'}}>
        <Box
          sx={{
            width: [hideLabel ? 60 : 48, hideLabel ? 60 : 36],
            height: [hideLabel ? 60 : 48, hideLabel ? 60 : 36],
            background: '#EAEAEA',
            display: 'inline-block',
            borderRadius: hideLabel ? 50 : 28,
            textAlign: 'center',
            cursor: 'pointer',
            lineHeight: [
              hideLabel ? '59px' : '48px',
              hideLabel ? '59px' : '34px',
            ],
            fontWeight: 'regular',
            userSelect: 'none',
            fontSize: 6,
            ':hover': {
              background: '#2F2F2F',
              color: '#FFFFFF',
            },
          }}
          onClick={handleDecrease}
        >
          -
        </Box>
        <Text
          sx={{
            variant: 'text.mediumTitle',
            width: 30,
            textAlign: 'center',
            mx: hideLabel ? 4 : 3,
            fontSize: hideLabel ? 7 : 6,
          }}
        >
          {ticketCount}
        </Text>
        <Box
          sx={{
            width: [hideLabel ? 60 : 48, hideLabel ? 60 : 36],
            height: [hideLabel ? 60 : 48, hideLabel ? 60 : 36],
            background: '#EAEAEA',
            display: 'inline-block',
            borderRadius: hideLabel ? 50 : 28,
            textAlign: 'center',
            cursor: 'pointer',
            lineHeight: [
              hideLabel ? '59px' : '48px',
              hideLabel ? '59px' : '34px',
            ],
            fontWeight: 'regular',
            userSelect: 'none',
            fontSize: 6,
            ':hover': {
              background: '#2F2F2F',
              color: '#FFFFFF',
            },
          }}
          onClick={handleIncrease}
        >
          +
        </Box>
      </Flex>
    </Flex>
  );
};
