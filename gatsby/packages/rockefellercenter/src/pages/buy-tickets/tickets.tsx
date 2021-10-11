/**@jsx jsx */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {jsx, Box, Flex, Container, Button} from '@tishman/components';
import {useLocation} from '@reach/router';
import {useEffect, useState, useRef, Fragment, useCallback} from 'react';
import {format} from 'date-fns';
import {useReactToPrint} from 'react-to-print';
import allPostsStore from '~buy-tickets/store/odt-posts/allPostsStore';
import systemVariableStore from '~buy-tickets/store/odt/systemVariableStore';
import ticketTypesStore from '~buy-tickets/store/odt/ticketTypesStore';
import {getItem$} from '~buy-tickets/services/http-client';
import dateService from '~buy-tickets/services/date-service';
import {PrintTicket, useIsMounted, ModalLoader} from '~components/BuyTickets';
import {standardError} from '~buy-tickets/constants/constants';

const {getEasternTime} = dateService();

const EFFECTIVE_DATETIME = format(new Date(getEasternTime), 'yyyy-MM-dd');

const Tickets = (): JSX.Element => {
  const isMounted = useIsMounted();
  const [isFromUrlFlow, setIsFromUrlFlow] = useState(true);
  const [saleId, setSaleId] = useState<string | null>('');
  const [ticketImages, setTicketImages] = useState(false);
  const [packageImages, setPackageImages] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [allPostsState, setAllPostsState] = useState(
    allPostsStore.initialState,
  );

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const getSaleIdFromUrl = useCallback(async () => {
    const search = new URLSearchParams(location.search);
    setSaleId(search.get('SaleId'));

    if (saleId) {
      const [
        status,
        systemVariables,
        sale,
        ticket,
        ticketTypes,
        packageTypes,
      ] = await Promise.all([
        getItem$(`Status`),
        getItem$(`SystemVariable`),
        getItem$(`Sale?saleId=${saleId}`),
        getItem$(`Ticket?saleId=${saleId}`),
        getItem$(`TicketType?EffectiveDateTime=${EFFECTIVE_DATETIME}`),
        getItem$(`PackageType?EffectiveDateTime=${EFFECTIVE_DATETIME}`),
      ]);
      status.subscribe(
        (x: any) => {
          if (x.status === 200) {
            const status = x.body.toString().replace(/[^a-zA-Z ]/g, ''); // Strip special characters from response.
            if (status === false || status === 'false') {
              const error = new Error(standardError.message);
              error.name = standardError.name;
              throw error;
            } else return null;
          } else return null;
        },
        (error: Error) => {
          throw error;
        },
      );
      systemVariables.subscribe(
        (x: any) => {
          systemVariableStore.sendData(x);
        },
        (error: Error) => {
          throw error;
        },
      );
      sale.subscribe(
        (res: any) => {
          allPostsStore.sendData(res, 'sale');
        },
        (error: Error) => {
          throw error;
        },
      );
      ticket.subscribe(
        (res: any) => {
          allPostsStore.sendData(res, 'ticket');
        },
        (error: Error) => {
          throw error;
        },
      );
      ticketTypes.subscribe((x: any) => {
        const TicketTypeIDs = x.map((t: any) => t.TicketTypeId);
        ticketTypesStore.sendData({TicketTypes: x});
        getItem$(`TicketTypeImage?TicketTypeIds=${TicketTypeIDs}`).subscribe(
          (y) => {
            ticketTypesStore.sendData({TicketTypeImages: y});
            setTicketImages(true);
          },
        ),
          (error: Error) => {
            throw error;
          };
      });
      packageTypes.subscribe((x: any) => {
        const PackageTypeIDs = x.map((t: any) => t.PackageTypeId);
        ticketTypesStore.sendData({PackageTypes: x});
        getItem$(`PackageTypeImage?PackageTypeIds=${PackageTypeIDs}`).subscribe(
          (y) => {
            ticketTypesStore.sendData({PackageTypeImages: y});
            setPackageImages(true);
          },
          (error: Error) => {
            throw error;
          },
        );
      });
    }
  }, [location.search, saleId]);

  useEffect(() => {
    if (isFromUrlFlow) {
      const effect = async () => {
        await getSaleIdFromUrl();
        if (!isMounted()) return;
        setIsFromUrlFlow(false);
      };
      effect();
    }
    if (ticketImages && packageImages) setShowLoader(false);
  }, [
    saleId,
    isMounted,
    isFromUrlFlow,
    setIsFromUrlFlow,
    ticketImages,
    packageImages,
    getSaleIdFromUrl,
  ]);

  useEffect(() => {
    const userSub = allPostsStore.subscribe(setAllPostsState);
    return () => userSub.unsubscribe();
  }, []);

  return (
    <Box sx={{position: 'relative'}}>
      {showLoader ? (
        <Box sx={{height: 800, width: '100%', position: 'relative'}}>
          <ModalLoader opacity={1} />
        </Box>
      ) : (
        <Fragment>
          <Flex sx={{mt: 4, justifyContent: 'center'}}>
            <Button
              sx={{
                variant: 'buttons.inverted',
                '@media print': {
                  display: 'none',
                },
              }}
              onClick={handlePrint}
            >
              Print Ticket{`${allPostsState?.ticket?.length > 1 ? 's' : ''}`}
            </Button>
          </Flex>
          <Container sx={{maxWidth: 1400}}>
            <PrintTicket ref={printRef} />
          </Container>
        </Fragment>
      )}
    </Box>
  );
};

export default Tickets;
