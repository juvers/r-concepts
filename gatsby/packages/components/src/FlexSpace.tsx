/**@jsx jsx */
import {jsx, Grid, Box, Text, Link} from '@tishman/components';
import {FluidObject} from 'gatsby-image';
import {a, useSpring} from 'react-spring';
import {useRef, useCallback, useLayoutEffect} from 'react';
import useIntersection from '@hzdg/use-intersection';
import useSize from '@hzdg/use-size';

interface FlexSpaceProps {
  spaceOne: SpaceProps;
  spaceTwo?: SpaceProps;
  bgImage: FluidObject;
}

interface SpaceProps {
  title?: string;
  description?: string;
  link?: {
    url?: string;
    label?: string;
  };
}

export const FlexSpace = ({
  spaceOne,
  spaceTwo,
  bgImage,
}: FlexSpaceProps): JSX.Element => {
  const spaceOneRef = useRef<HTMLDivElement>(null);
  const spaceTwoRef = useRef<HTMLDivElement>(null);
  const [growStyle1, animateGrow1] = useSpring(() => ({height: 0}));
  const [growStyle2, animateGrow2] = useSpring(() => ({height: 0}));
  const [fadeStyle, animateFade] = useSpring(() => ({opacity: 0}));

  const measureAndUpdate = useCallback(() => {
    if (spaceOneRef.current)
      void animateGrow1({
        height: spaceOneRef.current.offsetHeight,
      });
    if (spaceTwoRef.current)
      void animateGrow2({
        height: spaceTwoRef.current.offsetHeight,
      });
  }, [animateGrow1, animateGrow2]);

  useLayoutEffect(() => {
    measureAndUpdate();
  }, [measureAndUpdate]);

  useSize(spaceOneRef, measureAndUpdate);
  useSize(spaceTwoRef, measureAndUpdate);

  const containerRef = useIntersection(
    ({isIntersecting, rootBounds, boundingClientRect: rect}) => {
      const intersects = isIntersecting || (rootBounds?.top ?? 0) >= rect.top;

      if (spaceOneRef.current)
        void animateGrow1({
          height: intersects ? spaceOneRef.current.offsetHeight : 0,
        });
      if (spaceTwoRef.current)
        void animateGrow2({
          height: intersects ? spaceTwoRef.current.offsetHeight : 0,
        });
      void animateFade({
        opacity: intersects ? 1 : 0,
        delay: intersects ? 100 : 0,
      });
    },
    {
      threshold: 0.4,
    },
  );

  return (
    <Grid
      ref={containerRef}
      sx={{
        px: [0, 6],
        pt: [0, 6],
        pb: spaceTwo?.title ? [0, 6] : [0, 164],
        gridTemplateColumns: ['1fr', '1fr 1fr'],
        gridAutoRows: 'auto',
        rowGap: [277, 6],
        gridTemplateAreas: [
          `
        'topL'
        'btmR'`,
          `
        'topL .'
        '. btmR'`,
        ],
        backgroundImage: `url(${bgImage.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        ref={spaceOneRef}
        sx={{
          position: 'relative',
          gridArea: 'topL',
          mr: [3, 0],
          px: [4, 5],
          pt: [4, 6],
          pb: [5, 7],
          maxWidth: 526,
        }}
      >
        <a.div
          style={growStyle1}
          sx={{
            position: 'absolute',
            background: 'black',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
        <a.div
          style={fadeStyle}
          sx={{
            position: 'relative',
          }}
        >
          <Text
            sx={{
              mb: 3,
              variant: 'styles.h2',
              fontFamily: 'headingSecondary',
              color: 'white',
              letterSpacing: 3,
            }}
          >
            {spaceOne.title}
          </Text>
          {spaceOne.description && (
            <Text
              variant="mediumP"
              sx={{mb: 4, fontSize: [2, 3], color: 'white'}}
            >
              {spaceOne.description}
            </Text>
          )}
          <Link
            variant="underline"
            sx={{
              color: 'white',
              '::after': {
                content: '""',
                position: 'absolute',
                backgroundColor: 'white',
                height: 2,
                left: 0,
                bottom: 0,
                right: 0,
                display: 'block',
              },
            }}
            href={spaceOne.link?.url || ''}
          >
            {spaceOne.link?.label}
          </Link>
        </a.div>
      </Box>
      {spaceTwo?.title && (
        <Box
          ref={spaceTwoRef}
          sx={{
            position: 'relative',
            gridArea: 'btmR',
            justifySelf: 'end',
            mr: [-3, 0],
            px: 4,
            pt: 4,
            pb: 5,
            maxWidth: 483,
            width: '100%',
          }}
        >
          <a.div
            style={growStyle2}
            sx={{
              position: 'absolute',
              background: 'white',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
          <a.div
            style={fadeStyle}
            sx={{
              position: 'relative',
            }}
          >
            <Text
              sx={{
                mb: 3,
                variant: 'styles.h4',
                fontFamily: 'headingSecondary',
                color: 'black',
              }}
            >
              {spaceTwo?.title}
            </Text>
            {spaceTwo.description && (
              <Text
                variant="mediumP"
                sx={{mb: 4, color: 'black', fontSize: [2, 3]}}
              >
                {spaceTwo.description}
              </Text>
            )}
            <Link
              variant="underline"
              sx={{
                color: 'black',
                '::after': {
                  content: '""',
                  position: 'absolute',
                  backgroundColor: 'black',
                  height: 2,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  display: 'block',
                },
              }}
              href={spaceTwo.link?.url || ''}
            >
              {spaceTwo.link?.label}
            </Link>
          </a.div>
        </Box>
      )}
    </Grid>
  );
};
