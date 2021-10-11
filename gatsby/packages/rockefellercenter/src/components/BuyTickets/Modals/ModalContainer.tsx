/** @jsx jsx */
import {jsx, Button, CloseSvg, usePageTransition} from '@tishman/components';
import {animated} from 'react-spring';
import {ReactNode} from 'react';

/**Modal Container is used to wrap the contents of Modals. Includes the animation
 * and close button.
 */

export const ModalContainer = ({
  closeModal,
  children,
}: {
  children: ReactNode;
  closeModal: () => void;
}): JSX.Element => {
  const slideInAnimation = usePageTransition({
    initial: {x: '100%'},
    enter: {x: '0%'},
    leave: {x: '100%'},
  });

  return (
    <animated.div
      style={slideInAnimation}
      sx={{
        bg: 'background',
        position: 'relative',
        placeSelf: 'stretch right',
        maxWidth: ['100%', 516],
        width: ['100%', '90%'],
        overflow: 'scroll',
      }}
    >
      <Button
        sx={{
          color: 'text',
          background: 'transparent',
          position: 'absolute',
          zIndex: 'overlay',
          top: 0,
          right: 0,
          p: 3,
          border: 'none',
          fontSize: '0px',
          '&:hover': {
            background: 'transparent !important',
            svg: {
              transform: 'scale(1.1)',
            },
          },
        }}
        onClick={closeModal}
      >
        <CloseSvg
          sx={{
            transition: 'transform 0.3s ease-in-out',
          }}
        />
      </Button>
      {children}
    </animated.div>
  );
};
