/** @jsx jsx */
import {jsx} from '@tishman/components';

import type {ReactNode} from 'react';

export const Spacer = ({children}: {children?: ReactNode}): JSX.Element => {
  return (
    <span sx={{':not(:last-child)::after': {content: "'·'", mx: 2}}}>
      {children}
    </span>
  );
};
