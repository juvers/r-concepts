/** @jsx jsx */
import type {MouseEvent} from 'react';
import {jsx, SxStyleProp} from '@tishman/components';
import useStore from './useStore';
import dateChoices from './dateChoices';

export const DateMenu: React.FC<{sx?: SxStyleProp}> = ({
  sx,
  className,
}: {
  sx?: SxStyleProp;
  className?: string;
}) => {
  const {setSelectedDate} = useStore((state) => state);
  return (
    <ul
      className={className}
      sx={{
        position: 'absolute',
        top: '100%',
        right: 0,
        px: 30,
        py: 22,
        bg: 'text',
        color: 'primary',
        lineHeight: 'body',
        width: 214,
        zIndex: 'overlay',
        minWidth: '100%',
        fontSize: [4, null, 5],
        ...sx,
      }}
    >
      {Object.keys(dateChoices).map((c) => (
        <li
          key={c}
          onClickCapture={(e: MouseEvent<HTMLElement>) => {
            setSelectedDate(e.currentTarget.innerText);
          }}
        >
          {c}
        </li>
      ))}
    </ul>
  );
};
