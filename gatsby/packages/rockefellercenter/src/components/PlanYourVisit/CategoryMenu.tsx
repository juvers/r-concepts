/** @jsx jsx */
import React from 'react';
import {jsx, Flex, Button, SxStyleProp} from '@tishman/components';
import useStore from './useStore';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {Category} from './types';

interface Item {
  name: string;
}

const SelectedIcon = ({selected}: {selected: boolean}) => {
  return (
    <span
      sx={{
        opacity: () => (selected ? 1 : 0),
        width: 15,
        height: 15,
        display: 'inline-block',
        bg: '#89CBDB',
        lineHeight: '17px',
        borderRadius: '50%',
        color: 'white',
        position: 'absolute',
        top: '0.4em',
        left: 0,
      }}
    >
      <svg
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          left: '1px',
        }}
        viewBox="0 0 17 17"
      >
        <path
          stroke="currentColor"
          fill="none"
          fillRule="evenodd"
          d="M3.2266 7.1959l2.4798 2.9174 5.5202-6"
        />
      </svg>
    </span>
  );
};

const CategoryMenuItem: React.FC<Item> = ({name}: Item) => {
  const {selectedCategories, addCategory, removeCategory} = useStore(
    (state) => state,
  );

  const selected = selectedCategories.includes(name);

  const handleClick = () => {
    if (selected) {
      removeCategory(name);
    } else {
      addCategory(name);
    }
  };

  return (
    <li
      aria-selected={selected}
      tabIndex={0}
      role="option"
      onKeyPress={handleClick}
      onClick={handleClick}
      sx={{
        fontSize: [3, 3, 4, 5],
        cursor: 'pointer',
        textAlign: 'left',
        pl: '24px',
        position: 'relative',
      }}
    >
      {name}
      <SelectedIcon selected={selected} />
    </li>
  );
};

export const CategoryMenu: React.FC<{sx?: SxStyleProp}> = ({
  sx,
  className,
}: {
  sx?: SxStyleProp;
  className?: string;
}) => {
  const {
    events,
    business,
  } = useStaticQuery<GatsbyTypes.PlanYourVisitCategoriesQuery>(graphql`
    query PlanYourVisitCategories {
      events: allSanityEvent {
        nodes {
          id
          category
        }
      }
      business: allSanityBusiness {
        nodes {
          id
          category {
            category
            subCategory
          }
        }
      }
    }
  `);

  const categories = useMemo(() => {
    return Array.from(
      (business.nodes as Category[])
        .concat(events.nodes)
        .reduce((categories, item) => {
          const {category} = item;
          if (typeof category === 'string') {
            categories.add(category);
          } else {
            category.subCategory.forEach((subCategory) =>
              categories.add(subCategory),
            );
          }
          return categories;
        }, new Set<string>()),
    );
  }, [events, business]);

  const {clearCategories} = useStore((state) => state);

  return (
    <Flex
      className={className}
      sx={{
        position: 'absolute',
        top: 'calc(100% + 10px)',
        left: '50%',
        transform: 'translateX(-50%)',
        px: 60,
        py: 40,
        bg: 'text',
        color: 'textInverted',
        maxWidth: 'calc(100vw - 20px)',
        width: ['calc(100vw - 40px)', null, '100%', '1110px'],
        '@media screen and (min-width: 1024px) and (max-width: 1099px)': {
          width: 'calc(100vw - 20px)',
        },
        flexDirection: 'column',
        zIndex: 'overlay',
        ...sx,
      }}
    >
      <ul
        sx={{
          fontSize: [5, null, 6, 7],
          lineHeight: 'body',
          display: 'grid',
          gridTemplateColumns: [
            'auto',
            'auto auto auto',
            'auto auto auto',
            'auto auto auto auto',
          ],
          '@media screen and (min-width: 1024px) and (max-width: 1130px)': {
            gridTemplateColumns: 'auto auto auto',
          },
          gridTemplateRows: 'auto',
          rowGap: [20, 20, 30, 30],
          columnGap: 15,
          zIndex: 'sticky',
          width: '100%',
        }}
      >
        {categories.map((name) => (
          <CategoryMenuItem key={name} name={name} />
        ))}
      </ul>
      <Button
        variant="iconUnderline"
        onClick={(e) => {
          e.preventDefault();
          clearCategories();
        }}
        sx={{
          alignSelf: 'flex-end',
          color: 'textInverted',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Clear All
      </Button>
    </Flex>
  );
};
