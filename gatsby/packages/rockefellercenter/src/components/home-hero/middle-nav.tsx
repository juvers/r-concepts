/** @jsx jsx */
import {useTrail, useChain, a} from 'react-spring';
import {jsx, Container, Flex, Grid, Box, Link} from '@tishman/components';
import {useRef} from 'react';

export interface MiddleNavProps {
  /**
   * Home Hero links
   * (Note per design, this is currently set up to have 4 links)
   *  */
  links: {
    url: string;
    label: string;
  }[];
}

const MiddleNav = ({links}: MiddleNavProps): JSX.Element => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  // Cut links in half to place on either side of image
  const halfWay = Math.floor(links.length / 2);
  const [leftLinks, rightLinks] = [
    links.slice(0, halfWay),
    links.slice(halfWay, links.length),
  ];

  const [leftTrail] = useTrail(leftLinks.length, () => ({
    config: {mass: 5, tension: 2000, friction: 100},
    opacity: 1,
    y: 0,
    ref: leftRef,
    from: {opacity: 0, y: 20},
    delay: 1000,
  }));

  const [rightTrail] = useTrail(rightLinks.length, () => ({
    config: {mass: 5, tension: 2000, friction: 100},
    opacity: 1,
    y: 0,
    ref: rightRef,
    from: {opacity: 0, y: 20},
    delay: 1000,
  }));

  useChain([leftRef, rightRef], [0, 0.5]);

  return (
    <Container
      sx={{
        display: ['none', null, null, 'block'],
        maxWidth: 1300,
        position: 'absolute',
        top: (theme) =>
          `calc(50% - ${
            // add nav offset so its above the background
            Array.isArray(theme.space) ? Number(theme.space[7]) : 88
          }px)`,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 'sticky',
      }}
    >
      <Grid
        sx={{
          gridTemplateColumns: [
            '1fr 540px 1fr',
            null,
            null,
            null,
            '1fr 650px 1fr',
          ],
          alignItems: 'center',
        }}
      >
        <Flex as="ul" sx={{flex: '1 1 auto', justifyContent: 'space-between'}}>
          {leftTrail.map(({y, ...rest}, index) => (
            <a.li
              key={leftLinks[index].label}
              style={{
                ...rest,
                transform: y.to((y) => `translate3d(0,${y}px,0)`),
                willChange: 'opacity transform',
              }}
            >
              <Link
                href={leftLinks[index].url}
                sx={{variant: 'links.underline'}}
              >
                {leftLinks[index].label}
              </Link>
            </a.li>
          ))}
        </Flex>
        <Box /> {/*  takes up space of image wrapping the text*/}
        <Flex as="ul" sx={{flex: '1 1 auto', justifyContent: 'space-between'}}>
          {rightTrail.map(({y, ...rest}, index) => (
            <a.li
              key={rightLinks[index].label}
              style={{
                ...rest,
                transform: y.to((y) => `translate3d(0,${y}px,0)`),
                willChange: 'opacity transform',
              }}
            >
              <Link
                href={rightLinks[index].url}
                sx={{variant: 'links.underline'}}
              >
                {rightLinks[index].label}
              </Link>
            </a.li>
          ))}
        </Flex>
      </Grid>
    </Container>
  );
};

export default MiddleNav;
