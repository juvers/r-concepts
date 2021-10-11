/** @jsx jsx */
import {Box, Flex, jsx, Link, Text} from '@tishman/components';
import {useEffect, useState, createContext, Dispatch} from 'react';
import {
  ContinueButton,
  RedemptionInput,
  CityPassType,
} from '~components/BuyTickets';
import userStore from '~buy-tickets/store/user/userStore';

declare interface CityPassCodeProps {
  description: string;
  limit: number;
  onContinue: () => void;
}

const MINIMUM_NUMBER_OF_FIELDS = 1;

export const ListContext = createContext<{
  list: CityPassType[];
  setList: Dispatch<CityPassType[]>;
}>({list: [], setList: () => []});

export const CityPassCodes = ({
  limit,
  description,
  onContinue,
}: CityPassCodeProps): JSX.Element => {
  const [userState, setUserState] = useState(userStore.initialState);
  const [list, setList] = useState(userStore.initialState);
  const [numOfFields, setNumOfFields] = useState(MINIMUM_NUMBER_OF_FIELDS);

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    return () => userSub.unsubscribe();
  }, []);

  useEffect(() => {
    setList(userState.redemptionCodes);
  }, [userState.redemptionCodes]);

  useEffect(() => {
    userStore.sendData({redemptionCodes: list});
    if (list.length && list.every((t: CityPassType) => t.TicketStatus === 0)) {
      userStore.sendData({canContinue: true});
    }
  }, [list]);

  const removeCode = (index: number) => {
    if (numOfFields > MINIMUM_NUMBER_OF_FIELDS) {
      setNumOfFields(numOfFields - 1);
      const filterList = list.filter(
        (_: CityPassType, i: number) => i !== index,
      );
      setList(filterList);
    } else {
      setList([{CityPassBarcode: ''}]);
    }
  };

  const addCode = () => {
    if (numOfFields + 1 < limit) {
      setNumOfFields(numOfFields + 1);
      setList([...list, {CityPassBarcode: ''}]);
    }
  };

  const handleContinue = () => {
    onContinue();
  };

  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        flexDirection: ['column', 'column', 'row'],
      }}
    >
      <Box sx={{maxWidth: 317}}>
        {description}
        <Text sx={{mt: 3, fontSize: 0}}>
          You may check if your CityPASS is valid without redeeming it. You may
          only redeem each CityPASS once.{' '}
          <Link variant="inline" to="/buy-tickets/citypass/">
            Click here
          </Link>{' '}
          to purchase a new CityPASS.
        </Text>
      </Box>
      <Box
        sx={{
          width: '100%',
          maxWidth: '455px',
          mt: [4, 4, -5],
        }}
      >
        <ListContext.Provider value={{list, setList}}>
          {list.length &&
            list.map((obj: CityPassType, i: number) => (
              <RedemptionInput
                key={`field ${i}`}
                handleMinusClick={removeCode}
                index={i}
                barcodeObject={obj}
              />
            ))}
        </ListContext.Provider>
        <Flex sx={{justifyContent: 'flex-end', marginBottom: '40px'}}>
          <Text
            variant="copyright"
            sx={{
              fontStyle: 'italic',
              marginRight: 3,
              paddingTop: 2,
            }}
          >
            Add another CityPass
          </Text>
          <Box
            sx={{
              width: '35px',
              height: '35px',
              fontSize: '22px',
              fontWeight: 'medium',
              textAlign: 'center',
              background: '#000',
              color: '#fff',
              lineHeight: '35px',
              cursor: 'pointer',
            }}
            onClick={addCode}
          >
            +
          </Box>
        </Flex>
        <ContinueButton
          title="Redeem Now"
          sx={{width: '100%', mt: 3}}
          handleClick={handleContinue}
        />
      </Box>
    </Flex>
  );
};

export default CityPassCodes;
