/** @jsx jsx */
import {graphql} from 'gatsby';
import {useMemo} from 'react';
import invariant from 'invariant';
import {jsx} from '@tishman/components';
import {Layout} from '~layouts';
import ArtHeroBlock from '~blocks/ArtHeroBlock';
import {ArtListBlock} from '~blocks/ArtListBlock';
import ArtDetailWideCtaBlock from '~blocks/ArtDetailWideCtaBlock';
import ArtDetailImageCalloutBlock from '~blocks/ArtDetailImageCalloutBlock';
import ArtDetailCalloutGridBlock from '~blocks/ArtDetailCalloutGridBlock';
import type {PageConfig} from '~PageConfig';
import {
  getLocationProps,
  getSanityFluidImageProps,
  getAuthorProps,
} from '~blocks/utils';

export const config: PageConfig = {
  theme: 'Rock Center Black',
  pageName: 'Art',
  cta: {to: '/buy-tickets', label: 'Buy Tickets'},
};

export default function ArtIndex({
  data: {art},
}: {
  data: GatsbyTypes.sanityArtIndexQuery;
}): JSX.Element {
  const items = useMemo(
    () =>
      art.nodes.map(
        (
          {category, excerpt, location, poster, titleAndSlug, authors},
          index,
        ) => {
          const slug = titleAndSlug.slug.current;
          invariant(slug, `A business slug is required`);
          return {
            index,
            slug,
            category,
            excerpt,
            url: `/amenities/${slug}`,
            title: titleAndSlug.title,
            authors: authors.map(getAuthorProps),
            location: getLocationProps(location),
            ...getSanityFluidImageProps(poster),
          };
        },
      ),
    [art],
  );

  return (
    <Layout theme="Rock Center Black" sx={{bg: 'background'}}>
      <ArtHeroBlock id="art-hero" />
      <ArtListBlock
        items={items}
        cta={config.cta}
        groupBy="title"
        featuredRetailers={undefined}
        filterBy={{Type: 'category'}} //, Location: 'location.title'
      />
      <ArtDetailWideCtaBlock theme="Rock Center" id="art-wide-cta" />
      <ArtDetailImageCalloutBlock id="art-image-callout" />
      <ArtDetailCalloutGridBlock theme="Rock Center" id="art-callout-grid" />
    </Layout>
  );
}

export const query = graphql`
  query sanityArtIndex {
    meta: sanityArtLp {
      seo {
        title: metaTitle
        description: metaDescription
      }
    }
    art: allSanityArt {
      nodes {
        id
        titleAndSlug {
          slug {
            current
          }
          title
        }
        category
        excerpt
        location {
          title
          address1
          address2
        }
        authors {
          name
          nationality
          birthYear
          deathYear
          countryOfBirth
        }
        poster {
          alt
          caption
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
        }
      }
    }
  }
`;
