/** @jsx jsx */
import {useRef, useState} from 'react';
// eslint-disable-next-line @tishman/prefer-tishman-components
import {jsx, Box} from 'theme-ui';
import {Global} from '@emotion/core';

import global from 'gatsby-theme-docz/src/theme/global';
import {Header} from '../Header';
import {Sidebar} from 'gatsby-theme-docz/src/components/Sidebar';
import {MainContainer} from 'gatsby-theme-docz/src/components/MainContainer';
import * as styles from 'gatsby-theme-docz/src/components/Layout/styles';

import type {ReactNode} from 'react';

export const Layout = ({children}: {children: ReactNode}): JSX.Element => {
  const [open, setOpen] = useState(false);
  const nav = useRef();

  return (
    <Box sx={{'& > div': {flex: '1 1 auto'}}} data-testid="layout">
      <Global styles={global} />
      <Box as="main" sx={styles.main}>
        <Header onOpen={() => setOpen((s) => !s)} />
        <div sx={styles.wrapper}>
          <Sidebar
            ref={nav}
            open={open}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onClick={() => setOpen(false)}
          />
          <MainContainer data-testid="main-container">{children}</MainContainer>
        </div>
      </Box>
    </Box>
  );
};
