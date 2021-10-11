/** @jsx jsx */
import {
  jsx,
  Flex,
  Box,
  Link,
  Section,
  Text,
  useFadeAnimationTrail,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {a} from 'react-spring';
import {DateSelector} from '../../components/PlanYourVisit/DateSelector';
import {DateMenu} from '../../components/PlanYourVisit/DateMenu';
import {CategorySelector} from '../../components/PlanYourVisit/CategorySelector';
import {CategoryMenu} from '../../components/PlanYourVisit/CategoryMenu';
import useStore from '../../components/PlanYourVisit/useStore';
import qs from 'query-string';
import {useMemo} from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import type {ComponentPropsWithoutRef} from 'react';

const PlanVisitForm = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    isCategoryListOpen,
    isDateListOpen,
    selectedDate,
    selectedCategories,
    setCategoryListOpen,
    setDateListOpen,
  } = useStore((state) => state);

  const url = useMemo(() => {
    const params: {date?: string; categories?: string} = {};

    if (selectedDate) {
      params.date = selectedDate;
    }

    if (selectedCategories.length > 0) {
      params.categories = selectedCategories.join(',');
    }

    return `/plan-visit/?${qs.stringify(params)}`;
  }, [selectedCategories, selectedDate]);

  const [trail, ref] = useFadeAnimationTrail({
    numberOfItems: 2,
    initialYPosition: -40,
  });
  const [trail1, trail2] = trail;

  return (
    <Section
      sx={{
        py: 6,
      }}
      {...props}
      ref={ref}
    >
      <a.div style={trail1}>
        <H
          sx={{
            variant: 'styles.h1',
            fontFamily: 'headingSecondary',
            mb: 4,
            textAlign: 'center',
          }}
        >
          Plan Your Visit
        </H>
      </a.div>
      <a.div style={trail2}>
        <Box sx={{position: 'relative', px: '20px'}}>
          <ClickAwayListener
            onClickAway={() => {
              setCategoryListOpen(false);
              setDateListOpen(false);
            }}
          >
            <Flex
              sx={{
                fontSize: [4],
                justifyContent: ['center', null, 'space-evenly'],
                alignItems: ['center', null, 'flex-end'],
                flexDirection: ['column', null, 'row'],
                flexWrap: ['nowrap'],
                maxWidth: '1200px',
                position: 'relative',
                mx: [null, null, 'auto'],
                top: [null, null, '-4px'],
              }}
            >
              <Box
                sx={{
                  minWidth: ['245px'],
                  fontWeight: 'regular',
                  fontFamily: 'headingSecondary',
                  mb: [3, 0],
                  flex: ['0 0 auto', '0 0 50%', '0 0 auto'],
                  width: ['100%', '50%', 'auto'],
                  position: [null, null, 'relative'],
                  top: [null, null, '4px'],
                }}
              >
                <DateSelector labelColor="text" sx={{minWidth: '100%'}}>
                  <Text
                    as="span"
                    sx={{
                      lineHeight: '69px',
                      fontFamily: 'headingSecondary',
                      fontWeight: 'regular',
                    }}
                  >
                    {selectedDate || 'When are you coming?'}
                  </Text>
                  {isDateListOpen && (
                    <DateMenu
                      sx={{fontSize: 'inherit', fontFamily: 'headingSecondary'}}
                    />
                  )}
                </DateSelector>
              </Box>

              <Box
                sx={{
                  top: '-4px',
                  minWidth: ['290px'],
                  mb: [5, 0],
                  mx: ['0px'],
                  flex: ['0 0 auto', '0 0 50%', '0 0 auto'],
                  width: ['100%', '50%', 'auto'],
                  px: [null, null, '20px'],
                  position: ['relative', null, 'static'],
                  transform: [null, null, null],
                }}
              >
                <CategorySelector labelColor="text" sx={{minWidth: '100%'}}>
                  <Text
                    as="span"
                    sx={{
                      lineHeight: '69px',
                      position: 'relative',
                      top: '4px',
                      fontFamily: 'headingSecondary',
                      fontWeight: 'regular',
                    }}
                  >
                    {selectedCategories.length > 0
                      ? `${selectedCategories.length} these categories`
                      : 'What are you interested in?'}
                  </Text>
                </CategorySelector>
                {isCategoryListOpen && (
                  <CategoryMenu
                    sx={{
                      fontFamily: 'headingSecondary',
                      fontWeight: 'regular',
                      width: ['100%', 'calc(200% - 40px)', 'calc(100% - 40px)'],
                      right: ['0px', 'calc(-50% + 20px)', '20px'],
                      left: ['unset'],
                      transform: ['none'],
                      px: ['20px', null, '30px'],
                    }}
                  />
                )}
              </Box>

              <Link
                variant="button"
                href={url}
                sx={{
                  mt: ['0px', '35px'],
                  position: [null, null, 'relative'],
                  top: [null, null, '4px'],
                }}
              >
                Explore
              </Link>
            </Flex>
          </ClickAwayListener>
        </Box>
      </a.div>
    </Section>
  );
};

export default PlanVisitForm;
