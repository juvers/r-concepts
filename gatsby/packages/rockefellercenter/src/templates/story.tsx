/** @jsx jsx */
import {jsx, Section, SanityRichText, Container} from '@tishman/components';

import {graphql} from 'gatsby';

import {Layout} from '~layouts';
import StoryHeroBlock from '~blocks/StoryHeroBlock';
import StoryShareBlock from '~blocks/StoryShareBlock';
import StoryWideCtaBlock from '~blocks/StoryWideCtaBlock';
import StoryRelatedStoriesBlock from '~blocks/StoryRelatedStoriesBlock';
import ShareYourExperienceBlock from '~blocks/ShareYourExperienceBlock';
import {storyComponents} from '~components/StoryComponents';

import type {Block} from '@sanity/block-content-to-react';

import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Green',
  pageName: 'The Center Magazine',
  cta: {
    to: '/buy-tickets',
    label: 'Buy Tickets',
  },
};

const StoryTemplate = ({
  data,
}: {
  data: GatsbyTypes.SanityStoryQuery;
}): JSX.Element => {
  return (
    <Layout theme="Rock Center Green">
      <StoryHeroBlock id="story-hero" data={data} />
      <Section id="story-story" theme="Rock Center">
        <Container pt={[6, 8]} pb={1}>
          {data?.story?._rawBody && (
            <SanityRichText
              blocks={(data.story._rawBody as unknown) as Block[]}
              components={storyComponents}
            />
          )}
        </Container>
      </Section>
      <StoryShareBlock id="story-share" theme="Rock Center" data={data} />
      <StoryRelatedStoriesBlock id="story-related-stories" data={data} />
      <StoryWideCtaBlock id="story-wide-cta" theme="Rock Center" data={data} />
      <ShareYourExperienceBlock
        id="share-your-experience"
        theme="Rock Center Cream"
      />
    </Layout>
  );
};

export const query = graphql`
  query SanityStory($sanityID: String!) {
    meta: sanityStory(id: {eq: $sanityID}) {
      seo {
        title: metaTitle
        description: metaDescription
      }
      poster {
        asset {
          fluid {
            source: src
          }
        }
        alt
      }
    }
    story: sanityStory(id: {eq: $sanityID}) {
      titleAndSlug {
        title
        slug {
          current
        }
      }
      category
      excerpt
      authors
      poster {
        asset {
          fluid {
            ...GatsbySanityImageFluid
          }
        }
        alt
      }
      formattedPublishAt: publishAt(formatString: "MMM D YYYY")
      _rawBody
      featuredStories {
        excerpt
        titleAndSlug {
          title
          slug {
            current
          }
        }
        category
        formattedPublishAt: publishAt(formatString: "MMM D YYYY")
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
    recentStories: allSanityStory(
      limit: 2
      sort: {fields: publishAt, order: DESC}
    ) {
      nodes {
        titleAndSlug {
          slug {
            current
          }
          title
        }
        category
        excerpt
        formattedPublishAt: publishAt(formatString: "MMM D YYYY")
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
    dataJson(id: {eq: "story"}) {
      wideCta {
        caption
        title
        link {
          label
          url
        }
      }
    }
  }
`;

export default StoryTemplate;
