/** @jsx jsx */
import {jsx, Section, Container} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import invariant from 'invariant';
import PressListItem, {PressListItemProps} from '~components/PressListItem';
import type {ComponentPropsWithoutRef} from 'react';

export const NEWS_AND_UPDATES_QUERY = graphql`
  query NewsAndUpdates {
    allSanityNewsPress(sort: {fields: [publishAt], order: DESC}) {
      nodes {
        source
        title
        excerpt
        publishAt
        formattedPublishAt: publishAt(formatString: "MMM D YYYY")
        externalLinks {
          ... on SanityUrlType {
            _key
            _type
            caption
            url
          }
        }
      }
    }
  }
`;

const NewsAndUpdatesListBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const results = useStaticQuery<GatsbyTypes.NewsAndUpdatesQuery>(
    NEWS_AND_UPDATES_QUERY,
  );

  invariant(
    results.allSanityNewsPress.nodes,
    'Could not fetch news and updates data',
  );

  const PressListElements = results.allSanityNewsPress.nodes.map(
    (node, index) => {
      const PressListItemProps: PressListItemProps & {key: string} = {
        title: node.title,
        excerpt: node.excerpt,
        externalLinks: ((node.externalLinks || []) as unknown) as {
          caption: string;
          url: string;
        }[],
        details: [node.formattedPublishAt, node.source],
        formattedPublishAt: node.formattedPublishAt,
        key: node.title || `${index}`,
      };

      return (
        <PressListItem {...PressListItemProps} key={PressListItemProps.key} />
      );
    },
  );

  return (
    <Section {...props}>
      <Container sx={{py: 4, px: [3, 5, 7, 9], maxWidth: 'content'}}>
        {PressListElements}
      </Container>
    </Section>
  );
};

export default NewsAndUpdatesListBlock;
