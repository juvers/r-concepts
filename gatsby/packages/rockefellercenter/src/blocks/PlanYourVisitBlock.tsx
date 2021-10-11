/** @jsx jsx */
import {useMemo, useEffect} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import invariant from 'invariant';
import qs from 'query-string';
import {parseISO, isWithinInterval} from 'date-fns';
import type {ComponentPropsWithoutRef} from 'react';

import {
  EventCarousel,
  ImageCardCarousel,
  Section,
  Sticky,
  jsx,
  ThemeProvider,
  getThemeByName,
} from '@tishman/components';
import Filter from '~components/PlanYourVisit/Filter';
import useStore from '~components/PlanYourVisit/useStore';
import dateChoices from '~components/PlanYourVisit/dateChoices';
import useIsMobile from '~breakpoints/useIsMobile';

import type {
  ImageCardCarouselProps,
  EventCarouselProps,
} from '@tishman/components';

import {getEventDetailUri} from '~blocks/utils/getEventDetailUri';

const PLAN_VISIT_QUERY = graphql`
  query PlanYourVisit {
    events: allSanityEvent {
      nodes {
        id
        type: _type
        formattedTime: startEndDateTime {
          start: startDateTime(formatString: "MMM D, h a")
          end: endDateTime(formatString: "MMM D, h a")
        }
        rawTime: startEndDateTime {
          start: startDateTime
          end: endDateTime
        }
        category
        photo {
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
        }
        titleAndSlug {
          title
          slug {
            current
          }
        }
        location {
          title
        }
      }
    }
    shopping: allSanityBusiness(filter: {category: {category: {eq: "shop"}}}) {
      nodes {
        id
        category {
          category
          subCategory
        }
        titleAndSlug {
          title
          slug {
            current
          }
        }
        poster {
          alt
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
        }
      }
    }
    dining: allSanityBusiness(filter: {category: {category: {eq: "dine"}}}) {
      nodes {
        id
        category {
          category
          subCategory
        }
        titleAndSlug {
          title
          slug {
            current
          }
        }
        poster {
          alt
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
        }
      }
    }
    attractions: dataJson(id: {eq: "iconic-experiences"}) {
      iconicExperiencesCarousel {
        cards {
          title
          description
          url
          image {
            alt
            src {
              fluid {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
      }
    }
  }
`;

const PlanYourVisit = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    selectedDate,
    selectedCategories,
    addCategories,
    setSelectedDate,
  } = useStore((state) => state);

  const {
    events,
    shopping,
    dining,
    attractions,
  } = useStaticQuery<GatsbyTypes.PlanYourVisitQuery>(PLAN_VISIT_QUERY);

  const isMobile = useIsMobile();

  useEffect(() => {
    const {categories, date}: {categories?: string; date?: string} =
      typeof window !== 'undefined' ? qs.parse(window.location.search) : {};
    if (categories) {
      addCategories(categories.split(','));
    }
    if (date) {
      setSelectedDate(date);
    }
  }, [addCategories, setSelectedDate]);

  invariant(attractions, 'Attractions JSON data required!');

  const attractionsData: ImageCardCarouselProps['data'] = useMemo(() => {
    return attractions.iconicExperiencesCarousel.cards.map((card) => ({
      title: card.title,
      description: card.description,
      fluid: card.image.src.fluid,
      href: card.url,
      id: card.title,
      alt: card.image.alt || card.title,
    }));
  }, [attractions]);

  const eventData = useMemo(() => {
    const rangeEnd: Date =
      dateChoices[selectedDate] || dateChoices['next year'];

    return events.nodes.reduce<EventCarouselProps['data']>((final, node) => {
      const eventEnd = parseISO(node.rawTime.end);

      const isInRange = isWithinInterval(eventEnd, {
        start: new Date(),
        end: rangeEnd,
      });

      if (isInRange) {
        invariant(node.photo.asset?.fluid, 'An event image is required!');
        final.push({
          fluid: node.photo.asset.fluid,
          category: node.category,
          title: node.titleAndSlug.title,
          formattedStartDateTime: node.formattedTime.start,
          location: node.location,
          url: getEventDetailUri(node),
          id: node.id,
        });
      }

      return final;
    }, []);
  }, [events, selectedDate]);

  const shoppingData = useMemo(() => {
    return shopping.nodes.reduce<ImageCardCarouselProps['data']>(
      (final, node) => {
        const shouldInclude =
          selectedCategories.length === 0
            ? true
            : node.category.subCategory.some((el) =>
                selectedCategories.includes(el as string),
              );

        if (shouldInclude) {
          invariant(node.poster.asset?.fluid, 'A shop image is required!');
          const slug = node.titleAndSlug.slug.current ?? '';
          final.push({
            fluid: node.poster.asset.fluid,
            alt: node.poster.alt || '',
            title: node.titleAndSlug.title,
            href: `/shops/${slug}`,
            description: '',
            id: node.id,
          });
        }

        return final;
      },
      [],
    );
  }, [shopping, selectedCategories]);

  const diningData = useMemo(() => {
    return dining.nodes.reduce<ImageCardCarouselProps['data']>(
      (final, node) => {
        const shouldInclude =
          selectedCategories.length === 0
            ? true
            : node.category.subCategory.some((el) =>
                selectedCategories.includes(el as string),
              );

        if (shouldInclude) {
          invariant(node.poster.asset?.fluid, 'A dine image is required!');
          const slug = node.titleAndSlug.slug.current ?? '';
          final.push({
            fluid: node.poster.asset.fluid,
            alt: node.poster.alt || '',
            title: node.titleAndSlug.title,
            href: `/dine/${slug ? slug : ''}`,
            description: '',
            id: node.id,
          });
        }

        return final;
      },
      [],
    );
  }, [dining, selectedCategories]);

  return (
    <Section {...props}>
      <ThemeProvider theme={getThemeByName('Rock Center Navy')}>
        <Sticky top="auto" disabled={isMobile} sx={{pointerEvents: 'none'}}>
          <Filter />
        </Sticky>
      </ThemeProvider>

      <ImageCardCarousel
        title="Attractions"
        seeAllLink={{
          url: '/attractions/',
          label: 'Explore Them All',
        }}
        carouselTitleSx={{
          fontSize: [6, null, 7, 8],
          visibility: 'visible',
        }}
        data={attractionsData}
      />
      {eventData && eventData.length > 0 && (
        <EventCarousel
          carouselTitleSx={{
            fontSize: [6, null, 7, 8],
            visibility: 'visible',
          }}
          title="Events"
          seeAllLink={{
            url: '/events/',
            label: 'See Full Calendar',
          }}
          data={eventData}
          sx={{pt: 0}}
        />
      )}
      {diningData && diningData.length > 0 && (
        <ImageCardCarousel
          title="Dining"
          seeAllLink={{
            url: '/dine/',
            label: 'See Them All',
          }}
          carouselTitleSx={{
            fontSize: [6, null, 7, 8],
            visibility: 'visible',
          }}
          data={diningData}
          sx={{pt: 0}}
        />
      )}
      {shoppingData && shoppingData.length > 0 && (
        <ImageCardCarousel
          title="Shopping"
          seeAllLink={{
            url: '/shops/',
            label: 'See Them All',
          }}
          carouselTitleSx={{
            fontSize: [6, null, 7, 8],
            visibility: 'visible',
          }}
          data={shoppingData}
          sx={{pt: 0}}
        />
      )}
    </Section>
  );
};

export default PlanYourVisit;
