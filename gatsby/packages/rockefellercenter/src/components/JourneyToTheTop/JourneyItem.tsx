/** @jsx jsx */
import {useSpring, animated} from 'react-spring';
import {FluidObject} from 'gatsby-image';
import useSize from '@hzdg/use-size';
import {H} from '@hzdg/sectioning';
import {
  OpenAccordionSvg,
  CloseAccordionSvg,
  Text,
  Box,
  Flex,
  jsx,
  IntrinsicImage,
} from '@tishman/components';

import type {FocusEvent, MouseEvent} from 'react';

export type JourneyItemProps = {
  /**
   * @param {string} title - title
   * @param {string} caption - caption
   * @param {string} alt - alt
   * @param {string} fluid - image
   * @param {boolean} active - active item
   * @param {number} index - item index
   * @param {callback} onClick - Callback that takes the current tabs' index.
   */

  title: string;
  caption: string;
  alt: string;
  active?: boolean;
  index: number;
  fluid: FluidObject;
  onClick: (index: number) => void;
};

export const JourneyItem = ({
  title,
  caption,
  fluid,
  onClick,
  index,
  alt,
  active,
}: JourneyItemProps): JSX.Element => {
  const [{borderBoxSize}, sizeRef] = useSize();
  const animation = useSpring({
    to: {
      height: active ? borderBoxSize.blockSize : 0,
      opacity: active ? 1 : 0,
      transform: `translate3d(0,${active ? 0 : -20}px,0)`,
    },
  });

  return (
    <Box sx={{mt: 4}}>
      <Flex
        tabIndex={0}
        aria-expanded={active}
        sx={{justifyContent: 'space-between', cursor: 'pointer'}}
        onClick={(e: MouseEvent) => {
          e.preventDefault();
          onClick(index);
        }}
        onFocus={(e: FocusEvent) => {
          e.preventDefault();
          onClick(index);
        }}
      >
        {title && (
          <H
            sx={{
              variant: 'text.faqItemTitle',
              mb: 2,
              maxWidth: 635,
              color: active ? 'accent' : 'initial',
            }}
          >
            {title}
          </H>
        )}
        <Box
          sx={{
            flex: `1 0 auto`,
            textAlign: 'right',
            ml: 3,
            justifyContent: 'flex-end',
            display: ['block', 'none'],
          }}
        >
          {active ? (
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
        <Box ref={sizeRef}>
          <Box
            sx={{
              position: 'relative',
              p: 3,
              borderStyle: 'solid',
              borderWidth: '2px',
              borderColor: 'accent',
              display: ['block', 'none'],
              width: 'fit-content',
            }}
          >
            <IntrinsicImage
              ratio={635 / 879}
              fluid={fluid}
              alt={alt}
              sx={{width: 212, height: 293}}
            />
          </Box>
          <Text sx={{maxWidth: 635, py: 3, opacity: 0.8}}>{caption}</Text>
        </Box>
      </animated.div>
    </Box>
  );
};
