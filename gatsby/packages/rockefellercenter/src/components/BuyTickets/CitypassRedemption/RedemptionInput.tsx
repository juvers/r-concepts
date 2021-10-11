/* eslint-disable @typescript-eslint/no-explicit-any */
/**@jsx jsx */

import {
  jsx,
  Flex,
  Box,
  Input,
  CheckProgress,
  CloseXSvg,
  Spinner,
} from '@tishman/components';
import {useState, ChangeEvent, useCallback, useContext, useMemo} from 'react';
import {debounce} from 'lodash';
import {formatISO, addMinutes} from 'date-fns';
import {useErrorHandler} from 'react-error-boundary';
import {getItem$} from '~buy-tickets/services/http-client';
import {ListContext} from '~components/BuyTickets';
import type {CityPassType} from '~components/BuyTickets';

interface RedemptionInputProps {
  barcodeObject: CityPassType;
  index: number;
  handleMinusClick: (index: number) => void;
}

function barcodeValidation(barcode: string) {
  const validBarcodeLengths = [14, 16, 19];
  // Matches 14 digit NY booklet/tickets
  const regex14digits = /^030\d{11}$/;
  // Matches 16 digit NY C3 barcodes
  const regexC316digits = /^3084588[\d]{9}$/;
  const regexC319digits = /^3084588[\d]{12}$/;
  // Matches 19 digit NY Core Mobile/Print at Home barcodes
  const regex19digits = /^30845803[\d]{11}$/;
  if (validBarcodeLengths.includes(barcode.length)) {
    if (
      regex14digits.test(barcode) ||
      regexC316digits.test(barcode) ||
      regexC319digits.test(barcode) ||
      regex19digits.test(barcode)
    ) {
      return true;
    }
  }
  return false;
}

function onlyNumbers(barcode: string) {
  const regex = /[\D\s]+/g;
  if (barcode.length === 0 || barcode.match(regex)) {
    return false;
  } else {
    return true;
  }
}

const updateList = (list: CityPassType[], obj: CityPassType, index: number) => {
  return list.reduce((items: CityPassType[], item: CityPassType, i: number) => {
    if (index === i) items.push(obj);
    else items.push(item);
    return items;
  }, []);
};

export const RedemptionInput = ({
  barcodeObject,
  handleMinusClick,
  index,
}: RedemptionInputProps): JSX.Element => {
  const [status, setStatus] = useState<number | undefined>(
    barcodeObject.TicketStatus,
  );
  const handleError = useErrorHandler();
  const {list, setList} = useContext(ListContext);

  const isUnique = useCallback(
    (code: string) => {
      const filter = list.filter(
        (x: CityPassType) => x.CityPassBarcode === code,
      );
      if (filter.length >= 2) return false;
      return true;
    },
    [list],
  );

  const validate = useMemo(() => {
    return debounce(async (code: string) => {
      if (onlyNumbers(code)) {
        if (barcodeValidation(code)) {
          setStatus(2);
          if (!isUnique(code)) {
            setStatus(1);
            return;
          }
          const datetime = formatISO(addMinutes(new Date(), 1));
          await getItem$(
            `CityPass/ValidateBarcodes?AttendanceDateTime=${datetime}&CityPassBarcodes=${code}`,
          ).subscribe(
            (res: any) => {
              const [response] = res.CityPassTickets;
              setStatus(response.TicketStatus);
              const resUpdate = {
                ...response,
                CityPassBarcode: code,
              };
              const updatedList = updateList(list, resUpdate, index);
              setList(updatedList);
            },
            (error: Error) => handleError(error),
          );
        }
      }
    }, 400);
  }, [handleError, index, isUnique, list, setList]);

  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          fontSize: 6,
          fontWeight: 'medium',
          flexGrow: 4,
          lineHeight: 'heading',
          marginRight: 2,
          '& > label': {marginTop: 0, marginBottom: 0},
          input: {
            fontSize: '30px',
            fontWeight: 'medium',
            borderBottom: 'none',
            padding: '2px',
            margin: 0,
            border: 'solid 1px rgba(0,0,0,0)',
            ':hover': {
              border: 'solid 1px #ddd',
            },
          },
        }}
      >
        <Input
          value={barcodeObject.CityPassBarcode}
          text=""
          maxLength={19}
          placeholder={'Enter CityPASS here...'}
          onChange={useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
              barcodeObject.CityPassBarcode = event.target.value;
              const updatedList = updateList(list, barcodeObject, index);
              setList(updatedList);
              if (!barcodeObject.TicketStatus) {
                validate(barcodeObject.CityPassBarcode);
              } else {
                setStatus(barcodeObject.TicketStatus);
              }
            },
            [barcodeObject, index, list, setList, validate],
          )}
        />
      </Box>
      {status === 0 && barcodeObject.CityPassBarcode.length > 0 && (
        <CheckProgress
          sx={{
            width: '18px',
            marginRight: '13px',
            height: '18px',
            borderRadius: '9px',
            color: '#fff',
            background: 'rgb(158, 194, 142)',
          }}
        />
      )}
      {status === 1 && barcodeObject.CityPassBarcode.length > 0 && (
        <CloseXSvg
          onClick={() => {
            const error = new Error(
              'This CityPASS code is not valid. Please try again.',
            );
            handleError(error);
          }}
          sx={{
            cursor: 'pointer',
            width: '18px',
            marginRight: '13px',
            color: 'red',
          }}
        />
      )}
      {status === 2 && barcodeObject.CityPassBarcode.length > 0 && (
        <Spinner sx={{width: 20, height: 20, marginRight: '13px'}} />
      )}
      <Box
        sx={{
          width: '35px',
          height: '35px',
          textAlign: 'center',
          border: 'solid 1.4px #000',
          fontSize: 4,
          fontWeight: 'light',
          lineHeight: '29px',
          cursor: 'pointer',
        }}
        onClick={() => {
          handleMinusClick(index);
        }}
      >
        -
      </Box>
    </Flex>
  );
};
