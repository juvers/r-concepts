/** @jsx jsx */
import {
  jsx,
  Flex,
  Box,
  SxStyleProp,
  Link,
  ScrollToTopLink,
} from '@tishman/components';
import useStore from './useStore';
import {H} from '@hzdg/sectioning';
import {DateSelector} from './DateSelector';
import {CategorySelector} from './CategorySelector';
import {CategoryMenu} from './CategoryMenu';
import {DateMenu} from './DateMenu';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const Filter: React.FC<{sx?: SxStyleProp}> = ({sx}: {sx?: SxStyleProp}) => {
  const {
    selectedDate,
    isCategoryListOpen,
    selectedCategories,
    isDateListOpen,
    setDateListOpen,
    setCategoryListOpen,
  } = useStore((state) => state);

  return (
    <Box>
      <Box
        sx={{
          pt: 5,
          pb: 7,
          height: 300,
          position: 'relative',
          zIndex: isCategoryListOpen || isDateListOpen ? 'overlay' : 'initial',
        }}
      >
        <Box
          sx={{
            bg: 'primary',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            transformOrigin: 'center top',
            transform: 'scaleY(1)',
            transition: 'transform 0.2s linear',
            '.sticky &': {
              transform: 'scaleY(0.4)',
            },
          }}
        />
        <Flex
          sx={{
            pointerEvents: 'auto',
            alignItems: 'center',
            px: [4],
            transform: 'translateY(0%)',
            transition: 'transform 0.2s linear',
            '.sticky &': {
              transform: 'translateY(-33%)',
            },
            ...sx,
          }}
        >
          <ScrollToTopLink
            sx={{
              display: 'none',
              '.sticky &': {
                display: ['none', null, null, 'inherit'],
              },
            }}
          />

          <H
            sx={{
              variant: 'styles.h1',
              fontFamily: 'headingSecondary',
              mx: 'auto',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            <ClickAwayListener
              onClickAway={() => {
                setDateListOpen(false);
                setCategoryListOpen(false);
              }}
            >
              <span
                sx={{
                  lineHeight: '1.23em',
                  paddingBottom: 0,
                  display: ['flex', 'inline-block'],
                  flexDirection: ['column'],
                  alignItems: ['center'],
                  fontSize: '1em',
                  transition: 'font-size 0.2s linear',
                  '.sticky &': {
                    fontSize: '0.52em',
                  },
                }}
              >
                <span sx={{display: 'inline-block'}}>
                  You are visiting&nbsp;
                </span>
                <span sx={{display: 'inline-block'}}>
                  Rockefeller Center&nbsp;
                </span>
                <DateSelector>
                  <span>{selectedDate || 'soon'}</span>
                  {isDateListOpen && (
                    <DateMenu
                      sx={{
                        right: ['50%', '0px'],
                        transform: ['translateX(50%)', 'none'],
                      }}
                    />
                  )}
                </DateSelector>
                <br sx={{display: ['none', 'initial']}} />
                <span sx={{display: 'inline-block'}}>
                  and are interested in&nbsp;
                </span>
                <span sx={{display: 'inline-block'}}>
                  <CategorySelector>
                    {selectedCategories.length === 0
                      ? 'everything'
                      : `${selectedCategories.length} categories`}
                  </CategorySelector>
                  .
                </span>
                {isCategoryListOpen && <CategoryMenu />}
              </span>
            </ClickAwayListener>
          </H>

          <Link
            variant="buttonInverted"
            to="/buy-tickets"
            sx={{
              display: 'none',
              '.sticky &': {
                display: ['none', null, null, 'inherit'],
              },
            }}
          >
            Buy Tickets
          </Link>
        </Flex>
      </Box>
    </Box>
  );
};

export default Filter;
