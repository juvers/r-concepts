/** @jsx jsx */
import {jsx, Flex, ArrowSvg, Link, Button} from '@tishman/components';

export interface MonthArrowLinkProps {
  calendar: string[];
  month: string;
}

/**
 * Arrow Disabled Button
 *
 * This disabled button is rendered when there is no href available
 * disabling a Link is bad for accessibility so instead, rendering
 * a disabled button will be best practice for this design
 *
 * @param {boolean} reverse direction of the arrow
 */
const ArrowDisabledButton = ({reverse = false}: {reverse?: boolean}) => (
  <Button
    disabled
    variant="icon"
    sx={{
      px: 3,
      py: 2,
    }}
  >
    <ArrowSvg
      sx={{
        transition: 'transform 0.3s ease-in-out',
        transform: `scale(${24 / 18}) rotate(${reverse ? '180deg' : '0'})`,
      }}
    />
  </Button>
);

/**
 * Arrow Link
 *
 * This link is used for going from month to month with
 * arrow svgs being rendered.
 *
 * @param {string!} href  the url of the next/previous month
 * @param {boolean} reverse direction of the arrow
 */
const ArrowLink = ({
  href,
  reverse = false,
}: {
  href: string;
  reverse?: boolean;
}) => {
  return (
    <Link
      variant="icon"
      href={href}
      sx={{
        px: 3,
        py: 2,
        '&:hover svg': {
          transform: reverse
            ? `translateX(-5px) scale(${24 / 18}) rotate(180deg)`
            : `translateX(5px) scale(${24 / 18}) rotate(0)`,
        },
      }}
    >
      <ArrowSvg
        sx={{
          transition: 'transform 0.3s ease-in-out',
          transform: `scale(${24 / 18}) rotate(${reverse ? '180deg' : '0'})`,
        }}
      />
    </Link>
  );
};

const EventMonthArrows = ({
  calendar,
  month,
}: MonthArrowLinkProps): JSX.Element => {
  const currentMonthIndex = calendar.findIndex((m) => m === month);
  const previousMonth = calendar[currentMonthIndex - 1];
  const nextMonth = calendar[currentMonthIndex + 1];
  return (
    <Flex
      sx={{
        mb: 0,
        // move container over so arrows align with title below
        transform: (theme) =>
          `translateX(-${
            Array.isArray(theme.space) ? Number(theme.space[2]) : 8
          }px)`,
      }}
    >
      {month === calendar[0] ? (
        <ArrowDisabledButton reverse />
      ) : (
        <ArrowLink href={`/events/${previousMonth}`} reverse />
      )}
      {month === calendar[calendar.length - 1] ? (
        <ArrowDisabledButton />
      ) : (
        <ArrowLink href={`/events/${nextMonth}`} />
      )}
    </Flex>
  );
};

export default EventMonthArrows;
