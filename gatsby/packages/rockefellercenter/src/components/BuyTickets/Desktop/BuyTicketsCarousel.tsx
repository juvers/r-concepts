/** @jsx jsx */
import {
  jsx,
  Flex,
  Button,
  SanityRichText,
  Box,
  CarouselContextProvider,
  CarouselList,
  useResponsiveValue,
} from '@tishman/components';
import {useState, useEffect} from 'react';
import {TicketCard} from './TicketCard';
import {CategoryHeader} from './CategoryHeader';
import {SidebarMenu} from './SidebarMenu';

import type {ReactNode} from 'react';
import type {TicketCategoryFeature, TicketCategory} from '../types';
export interface BuyTicketsCarouselProps extends TicketCategory {
  allFeatures: TicketCategoryFeature[];
  allCategories: TicketCategory[];
}

const SpaceBox = ({children}: {children?: ReactNode}) => (
  <Box sx={{flex: '0 0 260px'}}>{children}</Box>
);

export function BuyTicketsCarousel(
  props: BuyTicketsCarouselProps,
): JSX.Element | null {
  const [hasMounted, setHasMounted] = useState(false);
  const [isFeaturesListOpen, setIsFeaturesListOpen] = useState(false);
  const defaultPageSize = useResponsiveValue([1, 1, 2, 3, 3, 4]);

  const {
    tickets,
    allFeatures,
    titleAndSlug,
    description,
    allCategories,
  } = props;

  const pageSize =
    tickets.length < defaultPageSize ? tickets.length : defaultPageSize;

  const itemSize = `calc((100% - (1.9rem * ${pageSize + 1})) / ${pageSize})`;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <CarouselContextProvider>
      <Flex
        sx={{
          flexWrap: 'wrap',
        }}
      >
        <SpaceBox />
        <CategoryHeader
          carouselTitle={titleAndSlug.title}
          description={<SanityRichText blocks={description} />}
        />
        <SpaceBox>
          <SidebarMenu categories={allCategories} currentCategory={props} />
        </SpaceBox>
        <Flex
          sx={{
            flexDirection: 'column',
            position: 'relative',
            pb: '0px',
            flex: '0 0 calc(100% - 261px)',
            opacity: !hasMounted ? 0 : 1,
          }}
        >
          <CarouselList
            maxWidth="100%"
            gap="1.9rem"
            pageSize={pageSize}
            autoSize={itemSize}
            sx={{
              minHeight: '410px',
              alignItems: 'stretch',
              '> li': {
                minWidth: '215px',
              },
              '> li > article': {
                height: '100%',
              },
            }}
          >
            {tickets &&
              tickets.length &&
              tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id || ticket.title}
                  {...ticket}
                  allFeatures={allFeatures}
                  openFeaturesList={isFeaturesListOpen}
                  image={ticket.image}
                  description={ticket.description}
                />
              ))}
          </CarouselList>
          {allFeatures && allFeatures.length && (
            <Box
              sx={{
                alignSelf: 'center',
                display: 'flex',
                justifyContent: 'flex-end',
                mt: [4, 0],
                mb: ['0px'],
                position: 'static',
                width: '100%',
                px: '32px',
                pb: '0px',
              }}
            >
              <Button
                onClick={() => {
                  setIsFeaturesListOpen(!isFeaturesListOpen);
                }}
                sx={{
                  width: '100%',
                  height: '52px',
                  mt: 4,
                  py: '0px',
                  px: '0px',
                }}
              >
                {isFeaturesListOpen ? 'Close' : 'Compare Tickets'}
              </Button>
            </Box>
          )}
        </Flex>
      </Flex>
    </CarouselContextProvider>
  );
}
