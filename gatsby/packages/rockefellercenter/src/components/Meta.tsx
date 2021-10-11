/** @jsx jsx */
import {jsx} from '@tishman/components';
import {memo} from 'react';
import {Helmet} from 'react-helmet';
import {useStaticQuery, graphql} from 'gatsby';

export interface Meta {
  name: string;
  content: string;
}

export interface MetaProps {
  title?: string;
  seoTitle?: string;
  description?: string;
  lang?: string;
  meta?: Meta[];
  keywords?: string[];
  source?: string;
}

const DEFAULT_META_QUERY = graphql`
  query DefaultMeta {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`;

export const Meta = memo(function Meta({
  title,
  seoTitle,
  description,
  lang = `en`,
  meta = [],
  keywords = [],
  source = '',
}: MetaProps): JSX.Element {
  const data = useStaticQuery<GatsbyTypes.DefaultMetaQuery>(DEFAULT_META_QUERY);
  const metaDescription =
    description ?? data.site?.siteMetadata?.description ?? '';
  const metaTitle = seoTitle ?? title ?? data.site?.siteMetadata?.title ?? '';
  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={metaTitle}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: data.site?.siteMetadata?.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        // TODO: Design some API around providing an image here.
        // {
        //   property: `og:image`,
        //   content: poster,
        // },
        {
          property: `twitter:image`,
          content: source,
        },
      ]
        .concat(
          keywords.length > 0
            ? {
                name: `keywords`,
                content: keywords.join(`, `),
              }
            : [],
        )
        .concat(meta)}
    />
  );
});
