/** @jsx jsx */
import {jsx, Box, SxStyleProp} from '@tishman/components';

interface EventDotProps {
  type: 'ONGOING' | 'FREE';
  /** Any overriding styles to change default styling */
  sx?: SxStyleProp;
  /** Some sx props get passed as classNames to components */
  className?: string;
}

const EventDot = ({type, sx, className}: EventDotProps): JSX.Element => {
  const bg = type === 'ONGOING' ? '#BEB1D7' : '#9EC28E';
  return (
    <Box
      sx={{
        bg,
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        left: '-16px',
        width: '10px',
        height: '10px',
        borderRadius: 'rounded',
        border: '1px solid',
        borderColor: 'background',
        ...sx,
      }}
      className={className}
    />
  );
};

export default EventDot;
