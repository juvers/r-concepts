/** @jsx jsx */
import {jsx, SxStyleProp} from '@tishman/components';
import React, {MouseEvent, KeyboardEvent} from 'react';
import useStore from './useStore';
import DropArrow from './DropArrow';

interface GenericCategories {
  categories?: Array<string>;
  children?: React.ReactNode | string;
  labelColor?: string;
  sx?: SxStyleProp;
  className?: string;
}

export const CategorySelector: React.FunctionComponent<GenericCategories> = ({
  children,
  labelColor = '#89CBDB',
  sx,
  className,
}: GenericCategories) => {
  const {isCategoryListOpen, setCategoryListOpen} = useStore((state) => state);

  const handeClick = (e: MouseEvent | KeyboardEvent) => {
    e.stopPropagation();
    setCategoryListOpen(!isCategoryListOpen);
  };

  return (
    <span
      tabIndex={0}
      role="button"
      onKeyPress={handeClick}
      onClick={handeClick}
      className={className}
      sx={{
        color: labelColor,
        display: 'inline-block',
        position: 'relative',
        pr: '24px',
        cursor: 'pointer',
        ...sx,
      }}
    >
      {children}

      <hr
        sx={{
          width: '100%',
          height: 1,
          position: 'absolute',
          bottom: '-4px',
          left: 0,
          margin: 0,
        }}
      />
      <DropArrow direction={isCategoryListOpen ? 'up' : 'down'} />
    </span>
  );
};
