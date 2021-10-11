/** @jsx jsx */
import {
  jsx,
  Box,
  Button,
  CloseSvg,
  usePageTransition,
  Flex,
  IntrinsicImage,
  Link,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {animated} from 'react-spring';
import {HoursAndAddress} from '@tishman/components';
import {FluidObject} from 'gatsby-image';
import {Fragment} from 'react';

interface BusinessCardProps {
  id?: string;
  mapId?: string;
  alt?: string;
  fluid?: FluidObject;
  title?: string;
  slug?: string;
  category?: string;
  hours?: string[];
  contactInfo?: {
    type: string;
    value: string;
  }[];
  location?: {
    title?: string;
    address1?: string;
    address2?: string;
  };
}

export const ModalBusinessMap = ({
  card,
  closeModal,
}: {
  card: BusinessCardProps;
  closeModal: () => void;
}): JSX.Element => {
  const formattedHours =
    card.hours &&
    card.hours.map((hour) => {
      // Format days to just render the short forms i.e., M - F, Sat, Sun
      return hour.replace(/day|on|es|nes|urs|ri|ur/gi, '');
    });

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
        maxWidth: ['100%', 625],
        width: ['100%', '90%'],
        overflow: 'scroll',
        marginTop: ['172px', 0],
      }}
    >
      {card && Object.keys(card).length > 0 && (
        <Fragment>
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
          <Box
            sx={{
              py: [4, 5, 7],
              px: [4, 5],
            }}
          >
            {card.title && (
              <H
                sx={{
                  variant: 'text.heading',
                  fontFamily: 'headingSecondary',
                  flex: '0 0 auto',
                  fontSize: [6, 7],
                  letterSpacing: 0,
                  my: [2, null, null, 0],
                  mr: [0, null, null, 6],
                  maxWidth: '500px',
                }}
              >
                {card.title}
              </H>
            )}
            <Flex
              sx={{
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                py: 3,
              }}
            >
              {location && (
                <Box pr={4}>
                  <HoursAndAddress
                    addressHeading="Contact & Directions"
                    location={card.location}
                    contactsInfo={card.contactInfo}
                  />
                </Box>
              )}
              {formattedHours && (
                <Box>
                  <HoursAndAddress
                    hoursHeading="Hours"
                    hours={formattedHours}
                  />
                </Box>
              )}
            </Flex>
            <Flex
              sx={{
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
              }}
            >
              <Link
                sx={{
                  mr: [3, 4],
                  px: [4, 5],
                }}
                variant="button"
                href={`https://www.google.com/maps/search/?api=1&query= ${card.title} ${card.location?.address1}`}
              >
                GET DIRECTIONS
              </Link>
              <Link
                variant="underline"
                href={
                  card.category === 'shop'
                    ? `/${card.category}s/${card.slug}`
                    : `/${card.category}/${card.slug}`
                }
                sx={{
                  height: 'fit-content',
                  pt: '24px',
                }}
              >
                LEARN MORE
              </Link>
            </Flex>
          </Box>
          {card.fluid && (
            <Box sx={{my: 2}}>
              <IntrinsicImage alt={card.alt} fluid={card.fluid} />
            </Box>
          )}
        </Fragment>
      )}
    </animated.div>
  );
};
