/**@jsx jsx */
import {jsx, Box, Text, Flex, ExternalLink} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {postItem$} from '~buy-tickets/services/http-client';
import {ShareTrip} from './ShareTrip';

interface IntroProps {
  title: string;
  confirmationNumber: string;
  saleId?: string;
  description?: string;
  flow: string;
  datetime: Date;
  isRefund?: boolean;
}
export const Intro = ({
  title,
  confirmationNumber,
  description,
  saleId,
  flow,
  datetime,
  isRefund,
}: IntroProps): JSX.Element => {
  const reportPrintEvent = () => {
    postItem$(`SalePrintEvent?SaleId=${saleId}`).subscribe();
  };

  return (
    <Box>
      <H
        sx={{
          maxWidth: [198, null, 385],
          mb: 3,
          variant: 'text.buyTicketsConfirmationTitle',
        }}
      >
        {title}
      </H>
      <Text
        sx={{
          variant: 'text.ticketPrice',
          pt: [0, 2],
          mb: [2, 3],
        }}
      >{`Confirmation #${confirmationNumber}`}</Text>
      <Text sx={{variant: 'text.smallP', maxWidth: 380, mb: 2}}>
        {description}
      </Text>
      {!isRefund && (
        <Flex sx={{pt: 3, flexWrap: 'wrap'}}>
          <ExternalLink
            sx={{
              variant: 'links.button',
              width: ['100%', 'initial'],
              textAlign: ['center', 'left'],
              mr: [0, 4],
              height: '100%',
            }}
            href={`/buy-tickets/tickets?SaleId=${saleId}`}
            onClick={reportPrintEvent}
          >
            Print Ticket
          </ExternalLink>
          <ShareTrip flow={flow} datetime={datetime} />
        </Flex>
      )}
    </Box>
  );
};
