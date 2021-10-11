/**@jsx jsx */
import {jsx, Box, CheckProgress} from '@tishman/components';

enum SegmentStatus {
  complete = 0,
  current = 1,
  incomplete = 2,
}

interface SegmentProps {
  status: SegmentStatus;
  first: boolean;
  last: boolean;
}

export interface ProgressTrackerProps {
  /** Total number of steps to be rendered. */
  steps: number;
  /** The current step */
  currentStep: number;
}

const renderPip = (status: SegmentStatus) => {
  switch (status) {
    case SegmentStatus.complete:
      return (
        <Box
          sx={{
            width: '18px',
            height: '18px',
            borderRadius: '9px',
            position: 'absolute',
            top: '3px',
            right: '3px',
            color: '#fff',
            background: 'rgb(158, 194, 142)',
          }}
        >
          <CheckProgress />
        </Box>
      );
    default:
      return (
        <Box
          sx={{
            width: '16px',
            height: '16px',
            position: 'absolute',
            border: 'solid 2px',
            borderRadius: '8px',
            top: '4px',
            right: '4px',
            background: '#fff',
            borderColor: '#000',
            backgroundColor: '#fff',
            backgroundImage: '',
          }}
        />
      );
      break;
  }
};

const RenderSegment = ({status, first, last}: SegmentProps): JSX.Element => (
  // Segment Container: determines the height of a segment, and has a right border
  <Box
    sx={{
      height: first ? '80px' : '100px',
      width: '50px',
      position: 'relative',
      borderRight: 'solid 1px',
      borderColor:
        status == SegmentStatus.complete
          ? 'rgb(158, 194, 142)'
          : last
          ? 'rgba(0,0,0,0)'
          : 'gray',
    }}
  >
    {/* Halo: Shows an outer ring if this is the current step */}
    <Box
      sx={{
        position: 'absolute',
        width: '26px',
        height: '26px',
        display: 'block',
        borderRadius: '13px',
        border: status == SegmentStatus.current ? 'solid 1px #000' : '',
        top: '-13px',
        right: status == SegmentStatus.current ? '-14px' : '-12px',
        background: status == SegmentStatus.current ? '#fff' : '',
      }}
    >
      {/* Pip: inner circle which is either a hollow circle, or shows the green checkmark */}
      {renderPip(status)}
    </Box>
  </Box>
);

/**
 * A vertical progress indicator. Shows multiple steps and marks the current step.
 *
 * This component requires a total number of steps and the current active step #.
 */
export const ProgressTracker = (props: ProgressTrackerProps): JSX.Element => {
  const currentStepIndex = props.currentStep - 1;
  const segments = new Array<SegmentStatus>(props.steps)
    .fill(SegmentStatus.complete)
    .fill(SegmentStatus.current, currentStepIndex, currentStepIndex + 1)
    .fill(SegmentStatus.incomplete, currentStepIndex + 1, props.steps);
  return (
    <Box sx={{display: ['none', null, 'block']}}>
      {segments.map((status: SegmentStatus, i: number) => {
        return (
          <RenderSegment
            status={status}
            first={i === 0}
            last={i === segments.length - 1}
            key={i}
          />
        );
      })}
    </Box>
  );
};
