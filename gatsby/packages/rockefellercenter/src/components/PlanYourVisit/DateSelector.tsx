/** @jsx jsx */
import {jsx, SxStyleProp} from '@tishman/components';
import useStore from './useStore';
import DropArrow from './DropArrow';

interface DateSelectorProps {
  children?: React.ReactNode | React.ReactNodeArray | string;
  labelColor?: string;
  sx?: SxStyleProp;
  className?: string;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  children,
  labelColor = '#89CBDB',
  sx,
  className,
}: DateSelectorProps) => {
  const {isDateListOpen, setDateListOpen} = useStore((state) => state);

  return (
    <span
      className={className}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setDateListOpen(!isDateListOpen);
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setDateListOpen(!isDateListOpen);
      }}
      sx={{
        color: labelColor,
        display: 'inline-block',
        position: 'relative',
        textDecoration: 'none',
        pr: '24px',
        ...sx,
      }}
      css={{
        cursor: 'pointer',
      }}
    >
      {children}
      <hr
        sx={{
          width: '100%',
          height: 1,
          position: 'absolute',
          bottom: 0,
          left: 0,
          margin: 0,
          color: 'text',
        }}
      />
      <DropArrow direction={isDateListOpen ? 'up' : 'down'} />
    </span>
  );
};
