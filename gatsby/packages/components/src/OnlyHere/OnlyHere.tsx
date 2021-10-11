/**@jsx jsx */
import {
  jsx,
  Grid,
  Box,
  Text,
  Link,
  DetailImageCardCarousel,
  DetailImageCarouselCardProps,
  CarouselContext,
  CarouselNavigation,
  usePagination,
  useFadeAnimationTrail,
} from '@tishman/components';
import Img from 'gatsby-image';
import {OnlyHereHeading} from './OnlyHereHeading';
import {a, useTransition, config} from 'react-spring';
import {useState} from 'react';

interface OnlyHereProps {
  caption: string;
  cards: DetailImageCarouselCardProps[];
}

export const OnlyHere = ({caption, cards}: OnlyHereProps): JSX.Element => {
  const pageState = usePagination({pages: cards.length});
  const nextImage = pageState.hasNext ? pageState.page + 1 : null;
  const [toggle, setToggle] = useState(true);

  const [trails, trailRef] = useFadeAnimationTrail({
    numberOfItems: 3,
    threshold: 0.4,
  });

  const transition = useTransition(cards[pageState.page], {
    from: {opacity: 0, y: toggle ? 170 : -170},
    enter: {opacity: 1, y: 0},
    leave: {opacity: 0, y: toggle ? -170 : 170},
  });

  const fade = useTransition(cards[pageState.page], {
    from: {opacity: 0},
    enter: {opacity: 1},
    leave: {opacity: 0},
  });

  const fadeDelay = useTransition(
    cards[pageState.hasNext ? pageState.page + 1 : pageState.page],
    {
      config: config.slow,
      from: {opacity: 0},
      enter: {opacity: 1},
      leave: {opacity: 0},
    },
  );

  return (
    <Box sx={{pb: [4, null, 4, 3, 4]}}>
      <OnlyHereHeading
        title="Only Here"
        caption={caption}
        link={{label: 'Explore All', url: '/attractions/'}}
      />
      <CarouselContext.Provider value={pageState}>
        <Grid
          ref={trailRef}
          sx={{
            height: 507,
            gridTemplateColumns: [
              null,
              null,
              null,
              '665px 300px 1fr',
              '708px 407px 1fr',
            ],
            gridTemplateRows: 507,
            gap: 0,
            display: ['none', 'none', 'none', 'grid', 'grid'],
          }}
        >
          <a.div style={trails[0]} sx={{position: 'relative'}}>
            {fade((firstImgStyle, firstImg) => (
              <a.div style={firstImgStyle}>
                <Img
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                  }}
                  fluid={{
                    ...firstImg.fluid,
                  }}
                  alt={firstImg.alt}
                />
              </a.div>
            ))}
          </a.div>
          <a.div
            style={trails[1]}
            sx={{
              display: 'flex',
              maxWidth: 290,
              pl: 4,
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {transition((textStyle, item) => (
              <a.div style={{position: 'absolute', ...textStyle}}>
                <Text
                  sx={{
                    variant: 'text.mediumTitle',
                    letterSpacing: 3,
                    maxWidth: 244,
                    mb: 2,
                  }}
                >
                  {item.title}
                </Text>
                <Text variant="mediumP" sx={{mb: 3}}>
                  {item.description}
                </Text>
                <Link
                  href={item.link?.url || ''}
                  variant="underline"
                  sx={{width: 'fit-content'}}
                >
                  {item.link?.label || ''}
                </Link>
              </a.div>
            ))}
            <CarouselNavigation
              onArrowClick={setToggle}
              sx={{position: 'absolute', bottom: 5, left: 3}}
            />
          </a.div>
          <a.div style={trails[2]} sx={{position: 'relative'}}>
            {fadeDelay((secondImgStyle, secondImg) => (
              <a.div style={secondImgStyle}>
                {nextImage && (
                  <Img
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                    }}
                    imgStyle={{objectPosition: 'left'}}
                    fluid={{
                      ...secondImg.fluid,
                    }}
                    alt={secondImg.alt}
                  />
                )}
              </a.div>
            ))}
          </a.div>
        </Grid>
      </CarouselContext.Provider>
      <DetailImageCardCarousel
        sx={{display: ['flex', 'flex', 'flex', 'none', 'none']}}
        data={cards}
        title=" "
      />
    </Box>
  );
};
