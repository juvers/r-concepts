/** @jsx jsx */
import {useState, ReactNode} from 'react';
import {useSpring, animated} from 'react-spring';
import useSize from '@hzdg/use-size';
import {H} from '@hzdg/sectioning';
import {
  OpenAccordionSvg,
  CloseAccordionSvg,
  Text,
  Box,
  Flex,
  jsx,
} from '@tishman/components';

import type {KeyboardEvent, MouseEvent} from 'react';

export type ThreeColMobileItemProps = {
  /**
   * @param {string} title -
   */

  title: string;
  showDefault: boolean;
  children: ReactNode;
};

export const ThreeColMobileItem = ({
  title,
  showDefault = false,
  children,
}: ThreeColMobileItemProps): JSX.Element => {
  const [showAnswer, setShowAnswer] = useState(showDefault);
  const [{borderBoxSize}, sizeRef] = useSize();

  const animation = useSpring({
    to: {
      height: showAnswer ? borderBoxSize.blockSize : 0,
      opacity: showAnswer ? 1 : 0,
      transform: `translate3d(0,${showAnswer ? 0 : -20}px,0)`,
    },
  });

  return (
    <Box sx={{mt: 4}}>
      <Flex
        tabIndex={0}
        aria-expanded={showAnswer}
        sx={{justifyContent: 'space-between', cursor: 'pointer'}}
        onClick={(e: MouseEvent) => {
          e.preventDefault();
          setShowAnswer(!showAnswer);
        }}
        onKeyPress={(e: KeyboardEvent) => {
          e.preventDefault();
          if (e.key === 'Enter' || e.key === ' ') {
            setShowAnswer(!showAnswer);
          }
        }}
      >
        {title && (
          <H
            sx={{
              variant: 'text.heroTitleSmall',
              fontFamily: 'headingSecondary',
              maxWidth: 635,
            }}
          >
            {title}
          </H>
        )}
        <Box
          sx={{
            flex: `1 0 auto`,
            textAlign: 'right',
            lineHeight: '2',
            ml: 3,
            justifyContent: 'flex-end',
          }}
        >
          {showAnswer ? (
            <CloseAccordionSvg sx={{height: 4, width: 20}} />
          ) : (
            <OpenAccordionSvg sx={{height: 18, width: 18}} />
          )}
        </Box>
      </Flex>
      <animated.div
        sx={{
          overflow: 'hidden',
          height: 0,
        }}
        style={animation}
      >
        <Text ref={sizeRef} sx={{maxWidth: 635, py: 3, opacity: 0.8}}>
          {children}
        </Text>
      </animated.div>
    </Box>
  );
};

export default ThreeColMobileItem;
