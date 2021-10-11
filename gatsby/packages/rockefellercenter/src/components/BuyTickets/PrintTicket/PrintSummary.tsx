/**@jsx jsx */
import {
  jsx,
  Flex,
  Box,
  Text,
  TicketIcon,
  CalendarIcon,
  ClockSvg,
  getThemeByName,
  ThemeProvider,
} from '@tishman/components';
import QRCode from 'react-qr-code';
interface SummaryProps {
  ticketNumber: string;
  ticketName: string;
  ticketName2: string | null;
  day: string;
  date: string;
  time: string;
}

export const PrintSummary = ({
  ticketName,
  ticketName2,
  day,
  date,
  ticketNumber,
  time,
}: SummaryProps): JSX.Element => {
  return (
    <Box
      sx={{
        borderRight: 'dashed 1px #333',
        borderBottom: 'dashed 1px #333',
        padding: [2, 4, 6],
        '@media print': {
          py: 4,
          pl: 4,
          pr: 5,
        },
      }}
    >
      <Box sx={{width: '100%'}}>
        <Text
          variant="mediumTitle"
          sx={{
            paddingBottom: 3,
            borderBottom: 'solid 1px #777',
            marginBottom: 3,
          }}
        >
          Your Ticket Summary
        </Text>
        {/* <Text
          sx={{
            paddingBottom: 3,
            marginBottom: 3,
            fontWeight: 500,
            borderBottom: 'solid 1px #777',
          }}
        >
          {customerName}
        </Text> */}
        <Flex sx={{width: '100%', justifyContent: 'space-between'}}>
          <Box>
            <Box sx={{height: 40}}>
              <ThemeProvider theme={getThemeByName('Rock Center Lavender')}>
                <TicketIcon sx={{height: 30, width: 30, color: 'background'}} />
              </ThemeProvider>
            </Box>
            <Text sx={{fontWeight: 500, marginBottom: 2}}>Ticket Type</Text>
            <Text>{`1 ${ticketName}`}</Text>
            <Text>{ticketName2}</Text>
          </Box>
          <Box>
            <Box sx={{height: 40}}>
              <ThemeProvider theme={getThemeByName('Top of the Rock Olive')}>
                <CalendarIcon sx={{fill: 'background'}} />
              </ThemeProvider>
            </Box>
            <Text sx={{fontWeight: 500, marginBottom: 2}}>Entry Date</Text>
            <Text>{day}</Text>
            <Text>{date}</Text>
          </Box>
          <Box>
            <Box sx={{height: 40}}>
              <ThemeProvider theme={getThemeByName('Top of the Rock Yellow')}>
                <ClockSvg sx={{color: 'background'}} />
              </ThemeProvider>
            </Box>
            <Text sx={{fontWeight: 500, marginBottom: 2}}>Entry Time*</Text>
            <Text>{time}</Text>
          </Box>
        </Flex>
        <Flex sx={{mt: 5, justifyContent: 'center'}}>
          {ticketNumber && (
            <QRCode sx={{maxWidth: '100%'}} value={ticketNumber} />
          )}
        </Flex>
        <Text
          sx={{
            textAlign: 'center',
            fontWeight: 500,
            marginTop: 3,
            position: 'relative',
          }}
        >
          #{ticketNumber}
        </Text>
        <Text sx={{fontSize: 0, marginTop: 5}}>
          *We kindly ask that you not queue or line up before your specific
          entry time.
        </Text>
        <Text sx={{fontSize: 0}}>
          No entry is allowed before designated times. Please be advised the use
          of tripods is strictly prohibited.
        </Text>
      </Box>
    </Box>
  );
};
