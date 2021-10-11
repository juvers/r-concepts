/** @jsx jsx */
import {jsx, Box, Text, Spacer, Link} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {stripTimeFromDates} from '../stripTimeFromDates';

interface EventDetailsProps {
  /** Event category type */
  category: string;
  /** Event Title*/
  title: string;
  /** Formatted State Date Time created using date-fns format function */
  formattedStartDateTime: string;
  /** Formatted End Date Time created using date-fns format function */
  formattedEndDateTime: string;
  /**
   * Location > title is whats currently being used, location also has
   * address1, address2 in case we need to use that in future
   */
  location: {
    title: string;
  };
  /** Admission Type controlled by sanity dropdown */
  admissionType?: string;
  /** Path to event detail page */
  url?: string;
  /** Function that executes on mouse enter */
  onHover: (index: number) => void;
  /** event index */
  index: number;
}

export const EventDetails = ({
  title,
  category,
  location,
  admissionType,
  formattedEndDateTime,
  formattedStartDateTime,
  url,
  index,
  onHover = () => [],
}: EventDetailsProps): JSX.Element => (
  <Box sx={{pr: 4, mb: 4, pb: 2}}>
    <header>
      <Text variant="categoryEyebrow" sx={{color: 'muted'}}>
        {category}
      </Text>
      {url ? (
        <Link
          to={url}
          variant="eventTitle"
          onMouseEnter={() => {
            onHover(index);
          }}
        >
          {title}
        </Link>
      ) : (
        <H sx={{variant: 'text.mediumTitle'}}>{title}</H>
      )}
    </header>
    <Text
      variant="eyebrow"
      sx={{
        mt: 2,
        mb: 3,
        display: 'flex',
        flexWrap: 'wrap',
        fontWeight: 'light',
      }}
    >
      <Spacer>
        {/* Removing the Below for launch */}
        {stripTimeFromDates(formattedStartDateTime)}—
        {stripTimeFromDates(formattedEndDateTime)}
      </Spacer>
      <Spacer>{location.title}</Spacer>
      {admissionType && <Spacer>{admissionType}</Spacer>}
    </Text>
  </Box>
);
