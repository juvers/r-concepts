/**@jsx jsx*/
import {useRef, useCallback, useLayoutEffect} from 'react';
import {Flex, Button, jsx, Box, SxStyleProp} from '@tishman/components';
import {useSpring, animated} from 'react-spring';
import useSize from '@hzdg/use-size';
import {useScrollTo} from '@tishman/components';

interface TabMenuProps {
  /**
   * TabMenu takes a list of tab objects and displays them in
   * a scrollable list with an active state animation. It takes
   * a callback funtion and passes in the index of the active
   * tab.
   * @callback any
   * @param {number} tab - current active tab index
   * @param {string[]} labels - list of tab objects
   * @param {callback} onTabChange - Callback that takes the
   * current tabs' index.
   * @param {string} tabColor - changes the color of the tab
   * indicator
   * @param {number} tabHeight - changes the height of the tab
   * indicator
   * @param {SxStyleProp} sx - Any overriding styles to change
   * default styling
   * @param {string} className - Some sx props get passed as
   * classNames to components
   */
  tab: number;
  labels: string[];
  onTabChange: (index: number) => void;
  sx?: SxStyleProp;
  className?: string;
  tabColor?: string;
  tabHeight?: number;
}

export const TabMenu = ({
  labels,
  onTabChange,
  tab = 0,
  className,
  sx,
  tabColor = 'text',
  tabHeight = 2,
}: TabMenuProps): JSX.Element => {
  const scrollport = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const scrollTo = useScrollTo({domTarget: scrollport});
  const [{x, scaleX}, animate] = useSpring(() => ({x: 0, scaleX: 100}));
  const measureAndUpdate = useCallback(() => {
    if (container.current) {
      const pageNode = container.current.childNodes[tab] as HTMLElement;
      if (pageNode) {
        void animate({x: pageNode.offsetLeft, scaleX: pageNode.offsetWidth});
        scrollTo(pageNode.offsetLeft);
      }
    }
  }, [tab, animate, scrollTo]);

  useLayoutEffect(() => {
    measureAndUpdate();
  }, [measureAndUpdate, labels]);

  useSize(container, measureAndUpdate);

  return (
    <Box
      className={className}
      pb={2}
      ref={scrollport}
      sx={{
        position: 'relative',
        borderColor: 'text',
        borderBottom: '1px solid',
        overflowX: 'scroll',
        overscrollBehaviorX: 'contain',
        scrollSnapType: 'x mandatory',
        scrollbarWidth: 'none',
        '::-webkit-scrollbar': {
          display: 'none',
        },
        ...sx,
      }}
    >
      <Flex
        ref={container}
        sx={{
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
        }}
      >
        {labels.map((label, index: number) => (
          <Button
            key={index}
            variant="tab"
            onClick={() => {
              onTabChange(index);
            }}
            sx={{
              flexShrink: 0,
              scrollSnapAlign: 'start',
              color: index === tab ? 'text' : 'muted',
              mx: 2,
              ':first-of-type': {
                ml: 0,
              },
              ':last-of-type': {
                mr: 0,
              },
              fontWeight: 'medium',
            }}
          >
            {label}
          </Button>
        ))}
      </Flex>
      <animated.div
        style={{x, scaleX}}
        sx={{
          transformOrigin: 'center left',
          pointerEvents: 'none',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 1,
          height: tabHeight,
          bg: tabColor,
        }}
      />
    </Box>
  );
};
