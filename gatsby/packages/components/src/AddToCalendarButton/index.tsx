/**@jsx jsx */
import {
  jsx,
  Button,
  Box,
  Link,
  SxStyleProp,
  CalendarIcon,
} from '@tishman/components';
import {useState, SyntheticEvent} from 'react';
import {useSpring, animated} from 'react-spring';
import useSize from '@hzdg/use-size';

import {buildShareUrl, Calenders, isInternetExplorer} from './utils';

interface AddToCalendarButtonProps {
  description: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  timezone?: string;
  label?: string;
  sx?: SxStyleProp;
  className?: string;
  url: string;
  icon?: boolean;
}

export const AddToCalendarButton = (
  props: AddToCalendarButtonProps,
): JSX.Element => {
  const [toggle, setToggle] = useState(false);
  const [{borderBoxSize}, sizeRef] = useSize();

  const animation = useSpring({
    to: {
      height: toggle ? borderBoxSize.blockSize : 0,
      opacity: toggle ? 1 : 0,
      transform: `translate3d(0,${toggle ? 0 : -20}px,0)`,
      paddingBottom: toggle ? borderBoxSize.blockSize : 0,
    },
  });

  const containerAnimation = useSpring({
    to: {
      marginBottom: toggle ? borderBoxSize.blockSize : 0,
    },
  });

  const handleCalenderClick = (e: SyntheticEvent) => {
    e.preventDefault();
    const url = e.currentTarget.getAttribute('href');
    if (url && url.startsWith('BEGIN')) {
      const blob = new Blob([url], {type: 'text/calendar;charset=utf-8'});

      if (isInternetExplorer()) {
        window.navigator.msSaveOrOpenBlob(
          blob,
          'event_at_rockefeller_center.ics',
        );
      } else {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'event_at_rockefeller_center.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (url) {
      window.open(url, '_blank');
    } else {
      throw new Error('Add to calendar is not working correctly!');
    }
  };

  return (
    <animated.div sx={{position: 'relative'}} style={containerAnimation}>
      {props.icon ? (
        <CalendarIcon
          sx={{cursor: 'pointer'}}
          onClick={(e) => {
            e.preventDefault();
            setToggle(!toggle);
          }}
        />
      ) : (
        <Button
          className={props.className}
          sx={{
            variant: 'inverted',
            ...props.sx,
          }}
          variant="inverted"
          onClick={(e) => {
            e.preventDefault();
            setToggle(!toggle);
          }}
        >
          {props.label || 'Add To Calendar'}
        </Button>
      )}
      <animated.div
        sx={{
          overflow: 'hidden',
          height: 0,
          position: 'absolute',
        }}
        style={animation}
      >
        <Box ref={sizeRef} sx={{pt: 2, pb: 3}}>
          <Box sx={{mb: 2}}>
            <Link
              variant="underline"
              href={buildShareUrl(props, Calenders.GOOGLE)}
              onClick={(e) => handleCalenderClick(e)}
            >
              {Calenders.GOOGLE}
            </Link>
          </Box>
          <Box sx={{mb: 2}}>
            <Link
              variant="underline"
              href={buildShareUrl(props, Calenders.ICAL)}
              onClick={(e) => handleCalenderClick(e)}
            >
              {Calenders.ICAL}
            </Link>
          </Box>
          <Box sx={{mb: 2}}>
            <Link
              variant="underline"
              href={buildShareUrl(props, Calenders.OUTLOOK)}
              onClick={(e) => handleCalenderClick(e)}
            >
              {Calenders.OUTLOOK}
            </Link>
          </Box>
        </Box>
      </animated.div>
    </animated.div>
  );
};
