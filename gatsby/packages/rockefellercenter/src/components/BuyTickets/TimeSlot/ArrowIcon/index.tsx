import React from 'react';

const DropdownArrowIcon = ({
  isActive = false,
}: Record<string, boolean | string>): JSX.Element => {
  return (
    <svg
      width="18"
      height="18"
      fill="none"
      id="arrow"
      className={isActive ? 'dropdown-arrow rotated' : 'dropdown-arrow'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.932,4.909 L8.9658,12.8388 L0.9988,4.9099"
        stroke={isActive ? '#FF8C00' : '#858893'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export {DropdownArrowIcon};
