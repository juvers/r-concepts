/** @jsx jsx */
import {jsx, Link, Box} from '@tishman/components';
import {format, differenceInCalendarDays} from 'date-fns';

// NOTE: Make sure you are passing the right time in the right time zone

interface TreeLightingCountdownProps {
  /* ISO string formatt of start datetime */
  startDateTime: string;
  /* ISO string formatt of end datetime */
  endDateTime: string;
}

const TreeLightingCountdown = ({
  startDateTime,
  endDateTime,
}: TreeLightingCountdownProps): JSX.Element => {
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);
  const dayDifference = differenceInCalendarDays(startDate, Date.now());
  return (
    <Box
      sx={{
        mb: [4, 6],
      }}
    >
      {dayDifference > -1 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto',
            gridTemplateRows: 'auto auto',
            gridAutoColumns: ['initial', 'initial', 'max-content'],
            color: 'text',
            font: 'body',
          }}
        >
          <Box
            sx={{
              gridColumnStart: 1,
              gridColumnEnd: 2,
              gridRowStart: 1,
              gridRowEnd: [3, 2],
              fontSize: 8,
              fontWeight: 'medium',
              lineHeight: 1,
              pr: 1,
              textAlign: 'center',
            }}
          >
            {dayDifference}
          </Box>
          <Box
            sx={{
              gridColumnStart: 2,
              gridColumnEnd: 3,
              gridRowStart: 1,
              gridRowEnd: 2,
              alignSelf: 'end',
              pl: [0, 1],
              fontSize: 2,
            }}
          >
            day{dayDifference === 1 ? null : 's'} until
          </Box>
          <Box
            sx={{
              gridColumnStart: [2, 1],
              gridColumnEnd: [3, 3],
              gridRowStart: 2,
              gridRowEnd: 3,
            }}
          >
            <Box
              sx={{
                color: 'accentSecondary',
                fontWeight: 'medium',
                fontSize: [2, 3, 5],
              }}
            >
              Christmas Day
            </Box>
            <Box sx={{display: ['none', 'inline-block']}}>
              <Box
                sx={{
                  color: 'accentSecondary',
                  display: 'inline',
                  fontSize: 5,
                  fontWeight: 'medium',
                }}
              >
                on&nbsp;
              </Box>
              <Box
                sx={{
                  color: 'text',
                  display: 'inline',
                  fontSize: 5,
                  fontWeight: 'medium',
                }}
              >
                {format(startDate, 'MMM d, yyyy')}
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              color: 'accentSecondary',
              fontWeight: 'medium',
              fontSize: [2, 3, 5],
            }}
          >
            The Christmas Tree was lit
          </Box>
          <Box
            sx={{
              color: 'accentSecondary',
              display: 'inline',
              fontSize: [2, 3, 5],
              fontWeight: 'medium',
            }}
          >
            until&nbsp;
          </Box>
          <Box
            sx={{
              color: 'text',
              display: 'inline',
              fontSize: [2, 3, 5],
              fontWeight: 'medium',
            }}
          >
            {`${format(endDate, 'ha')} on ${format(endDate, 'MMM d, yyyy')}`}
          </Box>
        </Box>
      )}
      <Box
        sx={{
          display: ['none', 'block'],
          mt: 3,
        }}
      >
        <Link
          variant="underline"
          key="Learn About the Tree"
          href="/holidays/rockefeller-center-christmas-tree-lighting/"
        >
          Learn About The Tree
        </Link>
      </Box>
    </Box>
  );
};

export default TreeLightingCountdown;
