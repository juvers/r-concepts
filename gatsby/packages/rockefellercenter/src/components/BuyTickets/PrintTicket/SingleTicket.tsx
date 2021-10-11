/**@jsx jsx */
import {jsx, Grid} from '@tishman/components';
import {
  PrintReceipt,
  PrintImage,
  PrintInstructions,
  PrintSummary,
} from '~components/BuyTickets';

import type {Tickets} from '~components/BuyTickets';

interface TicketProps {
  ticketName: string;
  ticketName2: string | null;
  ticketNumber: string;
  day: string;
  date: string;
  time: string;
  imageUrl: string;
  datetime: string;
  ticketList: Tickets[];
  offset?: number;
}

export const SingleTicket = ({
  offset,
  ticketName,
  ticketName2,
  ticketNumber,
  day,
  date,
  time,
  imageUrl,
  datetime,
  ticketList,
}: TicketProps): JSX.Element => {
  return (
    <Grid
      sx={{
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 0,
        '@media print': {
          position: 'absolute',
          top: offset,
          left: 0,
          right: 0,
          bottom: 0,
          pageBreakAfter: 'avoid',
          pageBreakInside: 'avoid',
          pageBreakBefore: 'avoid',
        },
      }}
    >
      <PrintSummary
        ticketName={ticketName}
        ticketName2={ticketName2}
        ticketNumber={ticketNumber}
        day={day}
        date={date}
        time={time}
      />
      <PrintReceipt datetime={datetime} ticketList={ticketList} />
      <PrintImage src={imageUrl} />
      <PrintInstructions />
    </Grid>
  );
};
