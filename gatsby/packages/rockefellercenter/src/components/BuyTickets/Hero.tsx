/**@jsx jsx */
import {jsx, Box, Flex, Text, Button} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {useErrorHandler} from 'react-error-boundary';
import {useState, useEffect, useContext} from 'react';
import userStore from '~buy-tickets/store/user/userStore';
import allPostsStore from '~buy-tickets/store/odt-posts/allPostsStore';
import {TimeContext, padTime} from '~components/BuyTickets';
export interface HeroProps {
  /** Title of the ticket flow */
  title: string;
  /** Optional link for up-sells */
  link?: {
    label?: string;
    modal?: string;
  };
  isRunning: boolean;
  showPrice?: boolean;
}

export const Hero = ({
  title,
  link,
  isRunning,
  showPrice = true,
}: HeroProps): JSX.Element => {
  const handleError = useErrorHandler();
  const timeValue = useContext(TimeContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const minutes: any = padTime(Math.floor(timeValue / 60));
  const seconds = padTime(timeValue - minutes * 60);
  const [userState, setUserState] = useState(userStore.initialState);

  const [allPostsState, setAllPostsState] = useState(
    allPostsStore.initialState,
  );

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    const postsSub = allPostsStore.subscribe(setAllPostsState);
    userSub.add(postsSub);
    return () => userSub.unsubscribe();
  }, []);

  return (
    <Flex
      sx={{
        mt: 2,
        pb: 5,
        mb: 2,
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <H
          sx={{
            variant: 'text.ticketsHeading',
            mb: 3,
            pb: 2,
            maxWidth: [220, '100%'],
          }}
        >
          {title}
        </H>
        {link && (
          <Button
            variant="underline"
            sx={{
              pt: 0,
              textAlign: 'left',
              maxWidth: [257, '100%'],
            }}
            onClick={() => {
              handleError(new Error(link.modal));
            }}
          >
            {link.label}
          </Button>
        )}
      </Box>
      <Flex
        sx={{
          textAlign: 'right',
          alignItems: 'center',
          justifyContent: isRunning ? 'flex-start' : 'flex-end',
        }}
      >
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
        <Box>
          <Text sx={{variant: 'text.ticketsHeading'}}>
            {showPrice && `$${userState.totalPrice}`}
          </Text>
          {allPostsState.sale && (
            <Text sx={{variant: 'text.taxHeading', mt: 2, textAlign: 'right'}}>
              {showPrice && `+$${allPostsState.sale.SaleTotalTax} Tax`}
            </Text>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};
