/**@jsx jsx */
/* eslint-disable @typescript-eslint/no-explicit-any*/
import {
  jsx,
  SxStyleProp,
  Box,
  Flex,
  SunsetIcon,
  ClockSvg,
} from '@tishman/components';
import {
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  Fragment,
  useCallback,
} from 'react';
import {TishmanFlow} from '~buy-tickets/constants/constants';

const trimMeridian = (slot: string): string => {
  return slot.slice(0, -3).padStart(2, '0');
};

const selectMeridian = (slot: string): string => {
  return slot.slice(-2);
};

const selectTimeSlot = (tme: string): string => {
  return tme.slice(tme.indexOf(':') + 1, -3);
};

const selectSx: SxStyleProp = {
  position: 'relative',
  height: '100px',
  backgroundColor: 'white',
  boxSizing: 'border-box',
  margin: '0 10px 0 10px',
  fontSize: '60px',
  lineHeight: '60px',
};

const contentSx: SxStyleProp = {
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  borderBottom: '2px solid #000',
  cursor: 'pointer',
};

const wrapperSx: SxStyleProp = {
  flexDirection: 'column',
  alignItems: 'flex-start',
  position: 'relative',
};

const nameSx: SxStyleProp = {
  fontSize: '60px',
  fontWeight: 500,
  color: '#000000',
};

const listSx: SxStyleProp = {
  width: '106px',
  maxHeight: '275px',
  overflowY: 'auto',
  position: 'absolute',
  backgroundColor: '#fff',
  listStyle: 'none',
  borderBottomLeftRadius: '10px',
  borderBottomRightRadius: '10px',
  zIndex: 1,
  boxShadow: '0px 20px 30px 7px rgba(0, 0, 0, 0.05)',
  top: '-5px',
  left: '-8px',
};

const minuteListSx: SxStyleProp = {
  ...listSx,
  width: '170px',
};

const itemSx: SxStyleProp = {
  alignItems: 'flex-end',
  lineHeight: '55px',
  textAlign: 'left',
  fontSize: '60px',
  fontWeight: 500,
  padding: '8px',
  ':hover': {
    backgroundColor: '#000',
    color: '#fff',
    cursor: 'pointer',
  },
};

const itemUnallowSx: SxStyleProp = {
  ...itemSx,
  color: 'rgba(0, 0, 0, 0.5)',
  cursor: 'not-allowed !important',
};

const scrollToChildElement = (doc: Document, parent: string, child: string) => {
  const container = doc.getElementById(parent);
  const ele = doc.getElementById(child);
  if (ele && container) {
    container.scrollTop = ele.offsetTop;
  }
};

export interface SelectProps {
  hourData: Record<string, any>;
  minuteData: Record<string, any>;
  onMinuteChanged: (item: Record<string, string>) => void;
  onUnavailable: () => void;
  selectedDate?: string;
  flow: string;
  minutesAheadAllowed?: number;
  minutesAheadFrom?: Date;
}

const Select = (props: SelectProps): JSX.Element => {
  const hourRef: MutableRefObject<any> = useRef();
  const minuteRef: MutableRefObject<any> = useRef();
  const [hourState, setHourState] = useState({
    isOpen: false,
    hourTitle: 'hr',
    shouldScroll: false,
  });
  const [minuteState, setMinuteState] = useState({
    isOpen: false,
    canOpen: false,
    hasOpened: false,
    minuteTitle: 'min',
    minuteDataset: [],
    minuteObject: {},
    shouldScroll: false,
  });
  const [selectedHour, setSelectedHour] = useState<null | string>(null);
  const [selectedMinute, setSelectedMinute] = useState<null | string>(null);
  const [selectedMeridian, setSelectedMeridian] = useState<null | string>(null);

  const minuteIsEnabled = useCallback(
    (item): boolean => {
      return (
        item.AvailableCapacity > 0 &&
        (props.minutesAheadAllowed == undefined ||
          new Date(item.StartDateTime) >
            new Date(
              (props.minutesAheadFrom == undefined
                ? Date.now()
                : props.minutesAheadFrom.getTime()) +
                props.minutesAheadAllowed * 60000,
            ))
      );
    },
    [props.minutesAheadAllowed, props.minutesAheadFrom],
  );

  const hourIsEnabled = useCallback(
    (item: string): boolean => {
      return (
        props.minuteData[`${item}`].filter((time) => {
          return minuteIsEnabled(time);
        }).length > 0
      );
    },
    [minuteIsEnabled, props.minuteData],
  );

  useEffect(() => {
    if (!(selectedHour || selectedMinute) && props.selectedDate) {
      const selectedDate = new Date(props.selectedDate);
      const hour = [
        ((selectedDate.getHours() + 11) % 12) + 1,
        selectedDate.getHours() > 12 ? ' PM' : ' AM',
      ].join('');

      setSelectedHour(hour);
      setSelectedMinute(
        [
          ':',
          selectedDate.getMinutes().toLocaleString('en-US', {
            minimumIntegerDigits: 2,
          }),
          selectedDate.getHours() > 12 ? ' PM' : ' AM',
        ].join(''),
      );
      setSelectedMeridian(selectedDate.getHours() >= 12 ? 'pm' : 'am');
      setMinuteState({
        ...minuteState,
        hasOpened: true,
        canOpen: true,
        minuteDataset: props.minuteData[`${hour}`],
      });
    }
  }, [
    props.selectedDate,
    props.minuteData,
    selectedHour,
    selectedMinute,
    setSelectedHour,
    setSelectedMinute,
    setMinuteState,
    minuteState,
  ]);

  useEffect(() => {
    if (!(selectedHour || selectedMinute) && props.hourData.length > 0) {
      // TODO: preselect the first available timeslot
      const firstAvailable = props.hourData.find((item) => {
        return hourIsEnabled(item);
      });
      if (firstAvailable) {
        setSelectedHour(firstAvailable);
        setSelectedMeridian(selectMeridian(firstAvailable));
        const filteredMinuteData = props.minuteData[`${firstAvailable}`];
        const firstMinuteSelection = filteredMinuteData.find((item) => {
          return minuteIsEnabled(item);
        });
        setMinuteState({
          ...minuteState,
          canOpen: true,
          minuteDataset: filteredMinuteData,
          hasOpened: false,
        });
        setSelectedMinute(firstMinuteSelection.MinuteTime);
        props.onMinuteChanged(firstMinuteSelection);
      }
    }
  }, [
    selectedHour,
    selectedMinute,
    props.hourData.length,
    props.hourData,
    props.minuteData,
    props,
    minuteState,
    hourIsEnabled,
    minuteIsEnabled,
  ]);

  const classNameAllowOrUnallow = (item: string): SxStyleProp =>
    hourIsEnabled(item) ? itemSx : itemUnallowSx;

  const generateLineId = (
    item: string,
    index: number,
    prefix: string,
    selectedValue: string | null,
  ) =>
    selectedValue && item === selectedValue
      ? prefix + '-selected'
      : prefix + '-' + index;

  const handleClick = ({target}: Event) => {
    if (
      hourRef?.current?.contains(target as HTMLElement) ||
      minuteRef?.current?.contains(target as HTMLElement)
    ) {
      return;
    }
    setHourState({...hourState, isOpen: false});
    setMinuteState({...minuteState, isOpen: false});
  };

  const onHourChange = (item: string) => {
    if (hourIsEnabled(item)) {
      setHourState({...hourState, isOpen: false});
      setSelectedHour(item);
      setSelectedMeridian(selectMeridian(item));
      const filteredMinuteData = props.minuteData[`${item}`];
      const firstMinuteSelection = filteredMinuteData.find(
        (item) => item.AvailableCapacity > 0,
      );
      setMinuteState({
        ...minuteState,
        canOpen: true,
        minuteDataset: filteredMinuteData,
        hasOpened: false,
      });
      setSelectedMinute(firstMinuteSelection.MinuteTime);
      props.onMinuteChanged(firstMinuteSelection);
    } else {
      props.onUnavailable();
    }
  };

  const onMinuteChange = (item: Record<string, any>) => {
    if (minuteIsEnabled(item)) {
      setMinuteState({
        ...minuteState,
        isOpen: false,
        hasOpened: true,
        minuteObject: item,
      });
      setSelectedMinute(item.MinuteTime);
      props.onMinuteChanged(item);
    } else {
      props.onUnavailable();
    }
  };
  const onHourOpen = () => {
    setHourState({...hourState, isOpen: !hourState.isOpen, shouldScroll: true});
  };

  const onMinuteOpen = () => {
    if (!minuteState.canOpen) return;
    setHourState({...hourState, isOpen: false});
    setMinuteState({
      ...minuteState,
      isOpen: !minuteState.isOpen,
      shouldScroll: true,
    });
  };

  const getMinuteLayout = (item: Record<string, any>): JSX.Element => {
    if (
      item.IsSunsetTimeslot &&
      (props.flow === TishmanFlow.DECK ||
        props.flow === TishmanFlow.ROCK_PASS ||
        props.flow === TishmanFlow.REDEMPTION) &&
      minuteIsEnabled(item)
    ) {
      return (
        <Fragment>
          <Box>{selectTimeSlot(item.FullTime)}</Box>
          <Box sx={{fontSize: '14px', lineHeight: '22px'}}>+$10</Box>
          <SunsetIcon
            style={{
              width: '32px',
              color: '#FFD758',
              fontWeight: 500,
              marginLeft: '6px',
            }}
          />
        </Fragment>
      );
    } else if (minuteIsEnabled(item)) {
      return <Fragment>{selectTimeSlot(item.FullTime)}</Fragment>;
    } else {
      return (
        <Flex sx={{alignItems: 'flex-end'}}>
          <Box sx={{opacity: 0.3}}>{selectTimeSlot(item.FullTime)}</Box>
          {props.flow === TishmanFlow.DECK && (
            <ClockSvg
              style={{
                height: '32px',
                color: '#89CBDB',
                marginLeft: '6px',
                paddingBottom: '6px',
              }}
            />
          )}
        </Flex>
      );
    }
  };

  const hourList = props.hourData.map(
    (item: string, index: number): JSX.Element => (
      <Box
        sx={classNameAllowOrUnallow(item)}
        key={item}
        aria-hidden="true"
        onClick={() => onHourChange(item)}
        id={`${generateLineId(item, index, 'hour', selectedHour)}`}
      >
        {trimMeridian(item)}
      </Box>
    ),
  );

  const minuteList = minuteState.minuteDataset?.map(
    (item: Record<string, any>, index: number): JSX.Element => (
      <Flex
        sx={itemSx}
        key={item.StartDateTime}
        aria-hidden="true"
        onClick={() => onMinuteChange(item)}
        id={`${generateLineId(
          item.MinuteTime,
          index,
          'minute',
          selectedMinute,
        )}`}
      >
        {getMinuteLayout(item)}
      </Flex>
    ),
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  });

  // If there is an time selected already, when the dropdown appears scroll to selection
  useEffect(() => {
    if (hourState.shouldScroll) {
      scrollToChildElement(document, 'hour-container', 'hour-selected');
      setHourState({...hourState, shouldScroll: false});
    }
    if (minuteState.shouldScroll) {
      scrollToChildElement(document, 'minute-container', 'minute-selected');
      setMinuteState({...minuteState, shouldScroll: false});
    }
  }, [hourState, minuteState]);

  return (
    <Flex
      sx={{
        alignItems: 'flex-end',
        boxSizing: 'border-box',
      }}
    >
      <Flex sx={selectSx} ref={hourRef}>
        <Flex sx={contentSx} aria-hidden="true" onClick={onHourOpen}>
          <Flex sx={wrapperSx}>
            <Box
              sx={{
                fontSize: '18px',
                opacity: 0.5,
                lineHeight: '26px',
              }}
            >
              hr
            </Box>
            <Box sx={nameSx}>
              {selectedHour ? trimMeridian(selectedHour) : '00'}
            </Box>
            {hourState.isOpen ? (
              <Box sx={listSx} id="hour-container">
                {hourList}
              </Box>
            ) : null}
          </Flex>
        </Flex>
      </Flex>
      <Box style={{fontSize: '48px'}}>:</Box>
      <Flex sx={selectSx} ref={minuteRef}>
        <Flex sx={contentSx} aria-hidden="true" onClick={onMinuteOpen}>
          <Flex sx={wrapperSx}>
            <Box
              sx={{
                fontSize: '18px',
                opacity: 0.5,
                lineHeight: '26px',
              }}
            >
              min
            </Box>
            <Box sx={nameSx}>
              {selectedMinute ? selectTimeSlot(selectedMinute) : '00'}
            </Box>
            {minuteState.isOpen ? (
              <Box id="minute-container" sx={minuteListSx}>
                {minuteList}
              </Box>
            ) : null}
          </Flex>
        </Flex>
      </Flex>
      <Box
        sx={{
          fontSize: '60px',
          lineHeight: '60px',
          fontWeight: 500,
          position: 'relative',
          ':after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: '25px',
            height: '2px',
            background: '#000',
            display: 'block',
          },
        }}
      >
        {selectedMeridian?.toLowerCase()}
      </Box>
    </Flex>
  );
};

export default Select;
