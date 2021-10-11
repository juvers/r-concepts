/** @jsx jsx */
import {
  jsx,
  Flex,
  CarouselContextProvider,
  CarouselList,
  CarouselNavigation,
  Button,
  CloseSvg,
  usePageTransition,
} from '@tishman/components';
import {
  ModalSocialCarouselCard,
  ModalSocialCarouselCardProps,
} from './ModalSocialCarouselCard';
import {animated} from 'react-spring';
import useSize from '@hzdg/use-size';

const ModalSocialCarouselList = ({
  cards,
  initialModalCardIndex,
}: {
  cards: ModalSocialCarouselCardProps[];
  initialModalCardIndex: number;
}): JSX.Element => {
  return (
    <CarouselList autoSize="100%" gap={0} initialPage={initialModalCardIndex}>
      {cards.map((card) => (
        <ModalSocialCarouselCard key={card.id} {...card} />
      ))}
    </CarouselList>
  );
};

export const ModalSocialCarousel = ({
  cards,
  initialModalCardIndex,
  closeModal,
}: {
  cards: ModalSocialCarouselCardProps[];
  initialModalCardIndex: number;
  closeModal: () => void;
}): JSX.Element => {
  const [{width: modalWidth}, sizeRef] = useSize();

  const slideInAnimation = usePageTransition({
    initial: {x: '100%'},
    enter: {x: '0%'},
    leave: {x: '100%'},
  });

  return (
    <animated.div
      ref={sizeRef}
      style={slideInAnimation}
      sx={{
        bg: 'background',
        position: 'relative',
        placeSelf: 'stretch right',
        maxWidth: 515,
        width: '90%',
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
      <CarouselContextProvider>
        <Flex
          sx={{
            position: 'absolute',
            right: 0,
            bg: 'background',
            height: 55, // same height as authorScreenName box
            zIndex: 'sticky',
            top: (theme) => {
              // Here is some sorcery
              // we need to absolutely position the navigation
              // under the image and to the right of the author
              // I used useSize to get the width of the modal
              // used the image ratio pulled from ./ModalSocialCarouselCard
              // calculated the bottom of image and added the margins to match
              // the authorScreenName margin
              const imageRatio = 350 / 515;
              const imageBottom = modalWidth * imageRatio;
              const mobileMargin = Array.isArray(theme.space)
                ? Number(theme.space[4])
                : 32;
              const desktopMargin = Array.isArray(theme.space)
                ? Number(theme.space[6])
                : 64;
              return [
                imageBottom + mobileMargin,
                null,
                imageBottom + desktopMargin,
              ];
            },
          }}
        >
          <CarouselNavigation sx={{mr: [3, null, 5]}} />
        </Flex>
        <ModalSocialCarouselList
          cards={cards}
          initialModalCardIndex={initialModalCardIndex ?? 0}
        />
      </CarouselContextProvider>
    </animated.div>
  );
};
