/** @jsx jsx */
import React from 'react';
import {jsx, DropArrowSvg} from '@tishman/components';

interface DropArrowProps {
  direction: 'up' | 'down';
}

const DropArrow: React.FC<DropArrowProps> = ({direction}: DropArrowProps) => (
  <DropArrowSvg
    sx={{
      color: 'text',
      verticalAlign: 'middle',
      transform: () => {
        return direction === 'up' ? 'rotate(180deg)' : 'rotate(0deg)';
      },
      transition: 'transform .2s linear',
      position: 'absolute',
      top: '50%',
      right: 0,
    }}
  />
);

export default DropArrow;
