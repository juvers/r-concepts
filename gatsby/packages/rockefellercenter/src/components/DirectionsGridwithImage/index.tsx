/** @jsx jsx */
import {
  jsx,
  Flex,
  Box,
  IntrinsicImage,
  Text,
  SubwaySvg,
  BusSvg,
  BikeSvg,
} from '@tishman/components';
import {Fragment} from 'react';
import {H} from '@hzdg/sectioning';
import {FluidObject} from 'gatsby-image';

interface Route {
  name: string;
  directions: string;
}

interface ThreeColumnContentGridwithImageProps {
  fluid: FluidObject;
  alt: string;
  title: string;
  routes?: Route[];
  description?: string;
}

const RouteDirection = (route: Route): JSX.Element => {
  return (
    <Fragment>
      <H
        sx={{
          variant: 'styles.h4',
          fontFamily: 'headingSecondary',
          pb: 1,
        }}
      >
        {route.name}:
      </H>
      <Text>{route.directions}</Text>
    </Fragment>
  );
};

const ThreeColumnContentGridwithImage = ({
  fluid,
  alt,
  title,
  routes,
  description,
}: ThreeColumnContentGridwithImageProps): JSX.Element => {
  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        alignItems: ['stretch', 'center'],
        flexDirection: ['column', 'column', 'row'],
      }}
    >
      <Flex
        sx={{
          flex: ['1 1 auto', '0 0 auto', '0 0 70%'],
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexDirection: ['column', 'column', 'row'],
          my: 3,
        }}
      >
        <Box>
          <Flex
            sx={{
              alignItems: 'flex-start',
              flexDirection: 'row',
            }}
          >
            <H
              sx={{
                flex: '0 0 auto',
                variant: 'styles.h2',
                fontFamily: 'headingSecondary',
                mb: 4,
              }}
            >
              {title}
            </H>
            <Box sx={{flex: '0 0 auto', mx: 3}}>
              {title === 'Subways' && <SubwaySvg />}
              {title === 'Buses' && <BusSvg />}
              {title === 'Citi Bike' && <BikeSvg />}
            </Box>
          </Flex>
          {description && (
            <Box
              sx={{
                pr: [2, 4, 7],
                pb: [3, 4],
              }}
            >
              <Text>{description}</Text>
            </Box>
          )}
          {routes && routes.length > 0 && (
            <Box>
              {routes.slice(0, 2).map((route, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      pr: [2, 4, 6],
                      pb: [3, 4],
                    }}
                  >
                    <RouteDirection {...route} />
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
        {routes && routes.length > 2 && (
          <Box mt={[0, null, 6]} mb={[3, null]}>
            {routes.slice(2, routes.length).map((route, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    pr: [2, 4, 6],
                    pb: [3, 4],
                  }}
                >
                  <RouteDirection {...route} />
                </Box>
              );
            })}
          </Box>
        )}
      </Flex>
      <Box
        sx={{
          flex: ['1 1 auto', '0 0 auto', '0 0 30%'],
          px: [1, 2],
          mb: [2, null],
          width: '100%',
        }}
      >
        <IntrinsicImage
          ratio={345 / 495}
          fluid={fluid}
          alt={alt}
          maxWidth={['none', '345px']}
        />
      </Box>
    </Flex>
  );
};

export default ThreeColumnContentGridwithImage;
