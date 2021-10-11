/** @jsx jsx */
import {jsx, Section, useThemeUI} from '@tishman/components';
import {useMemo, Fragment} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import {BuyTicketsDesktop} from './Desktop';
import {BuyTicketsMobile} from './Mobile';
import useSize from '@hzdg/use-size';

import type {TicketCategory, TicketCategoryFeature} from './types';

export function BuyTicketsApp(): JSX.Element {
  const {allCategories, allFeatures} = useStaticQuery(graphql`
    {
      allCategories: allSanityTicketCategory {
        nodes {
          id
          description: _rawDescription(resolveReferences: {maxDepth: 10})
          order
          titleAndSlug {
            title
            slug {
              current
            }
          }
          tickets {
            image {
              asset {
                fluid {
                  src
                  srcSet
                  srcSetWebp
                  srcWebp
                  sizes
                  base64
                }
              }
            }
            description: _rawDescription(resolveReferences: {maxDepth: 10})
            price
            url {
              url
            }
            title
            includedFeatures {
              description: _rawDescription
              order
              id
            }
            id: _id
          }
        }
      }
      allFeatures: allSanityTicketCategoryFeature {
        nodes {
          description: _rawDescription(resolveReferences: {maxDepth: 10})
          id
          order
          category {
            id
          }
        }
      }
    }
  `);

  const categories = useMemo((): TicketCategory[] => {
    const nodes: TicketCategory[] = allCategories.nodes;
    return nodes.sort((a: TicketCategory, b: TicketCategory): number => {
      return a.order - b.order;
    });
  }, [allCategories]);

  /*
   *  Create a map of category ids to an array of
   *  features for that category
   */
  const features = useMemo(() => {
    const nodes: TicketCategoryFeature[] = allFeatures.nodes;
    return nodes.reduce<Record<string, TicketCategoryFeature[]>>(
      (final, obj: TicketCategoryFeature) => {
        const {category, description, id, order} = obj;
        const item: TicketCategoryFeature[] = final[category.id] || [];
        item.push({description, id, order, category});
        return {
          ...final,
          [category.id]: item,
        };
      },
      {},
    );
  }, [allFeatures]);

  const [{width: sectionWidth}, sectionRef] = useSize();
  const {theme} = useThemeUI();
  const mobileBreakpoint = parseInt(theme?.breakpoints?.[0] || '640px');

  return (
    <Section ref={sectionRef} theme="Rock Center">
      {typeof window === 'undefined' ? (
        <Fragment>
          <BuyTicketsDesktop
            allFeatures={features}
            allCategories={categories}
          />
          <BuyTicketsMobile allFeatures={features} allCategories={categories} />
        </Fragment>
      ) : sectionWidth > 0 && sectionWidth >= mobileBreakpoint ? (
        <BuyTicketsDesktop allFeatures={features} allCategories={categories} />
      ) : (
        <BuyTicketsMobile allFeatures={features} allCategories={categories} />
      )}
    </Section>
  );
}
