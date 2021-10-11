/** @jsx jsx */
import {
  jsx,
  Box,
  Grid,
  SxStyleProp,
  useScrollTo,
  CarouselList,
  usePagination,
  CarouselNavigation,
  GalleryCarouselCard,
  PrivateEventGalleryCard,
  CarouselContext,
  PrivateEventGalleryCardProps,
} from '@tishman/components';
import {useLayoutEffect, useRef} from 'react';

export interface PrivateEventGalleryProps {
  images: Omit<PrivateEventGalleryCardProps, 'onClick' | 'index'>[];
  /** Any overriding styles to change default styling */
  sx?: SxStyleProp;
  /** Some sx props get passed as classNames to components */
  className?: string;
}

export function PrivateEventGallery({
  images,
  sx,
  className,
}: PrivateEventGalleryProps): JSX.Element {
  const pageState = usePagination({pages: images.length});
  const scrollPort = useRef(null);
  const ref = useRef<HTMLDivElement>(null);
  const scrollTo = useScrollTo({domTarget: scrollPort, behavior: 'smooth'});

  useLayoutEffect(() => {
    scrollTo(ref);
  }, [pageState.page, scrollTo]);

  if (images.length === 1) {
    return <GalleryCarouselCard {...images[0]} sx={sx} className={className} />;
  }
  return (
    <CarouselContext.Provider value={pageState}>
      <CarouselList gap={0} autoSize="100%" pageSize={1}>
        {images.map((image, index) => (
          <GalleryCarouselCard key={index} {...image} />
        ))}
      </CarouselList>
      <Box sx={{position: 'relative', mx: [0, 5], ...sx}} className={className}>
        <CarouselNavigation
          sx={{
            position: 'absolute',
            top: ['100%', '50%'],
            mt: [2, 0],
            transform: ['translateY(0)', 'translateY(-50%)'],
            left: [0, -5],
            right: [0, -5],
            justifyContent: ['center', 'space-between'],
          }}
        />

        <Grid
          ref={scrollPort}
          as="ul"
          role="region"
          gap={2}
          tabIndex={0}
          sx={{
            ...sx,
            position: 'relative',
            gridAutoFlow: 'column',
            overflowX: 'scroll',
            overscrollBehaviorX: 'contain',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            '::-webkit-scrollbar': {
              display: 'none',
            },
            gridTemplateColumns: `
            repeat(auto-fit, 235px)
          `,
            mt: 4,
            display: ['none', 'grid'],
          }}
        >
          {images.map((image, index) => (
            <PrivateEventGalleryCard
              ref={index === pageState.page ? ref : null}
              key={index}
              {...image}
              index={index}
              active={index == pageState.page}
              onClick={pageState.goto}
            />
          ))}
        </Grid>
      </Box>
    </CarouselContext.Provider>
  );
}
