/**@jsx jsx */
import {jsx, Text, Box} from '@tishman/components';
import {useState, useEffect} from 'react';
import {CreditCardTypes} from '~buy-tickets/constants/constants';
import userStore from '~buy-tickets/store/user/userStore';

const textStyle = {lineHeight: 'body', fontSize: 5};

export const Contact = (): JSX.Element => {
  const [userState, setUserState] = useState(userStore.initialState);

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    return () => userSub.unsubscribe();
  }, []);

  return (
    <Box sx={{mt: 5}}>
      <Text variant="rockCenterPageName" sx={{marginBottom: 3}}>
        Contact and Billing
      </Text>
      <Text variant="largeP" sx={textStyle}>
        {userState.name}
      </Text>
      <Text variant="largeP" sx={textStyle}>
        {userState.email}
      </Text>
      <Text variant="largeP" sx={textStyle}>
        {userState.card &&
          `${Object.keys(CreditCardTypes).find(
            (key: string) => CreditCardTypes[key] === userState.cardType,
          )} ****${userState.card}`}
      </Text>
      <Text variant="largeP" sx={textStyle}>
        {userState.country}
      </Text>
      <Text variant="largeP" sx={textStyle}>
        {userState.address1}
      </Text>
      <Text variant="largeP" sx={textStyle}>
        {userState.address2}
      </Text>
    </Box>
  );
};
