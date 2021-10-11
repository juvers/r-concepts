/**@jsx jsx */
import {jsx, FeaturedGallery, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const WORKING_COMMUNITY_FEATURED_GALLERY_QUERY = graphql`
  query WorkingCommunityFeaturedGallery {
    dataJson(id: {eq: "working-community"}) {
      workingCommunityFeaturedGallery {
        title
        content {
          category
          caption
          image {
            src {
              fluid(maxWidth: 1200) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
            alt
          }
          links {
            url
            label
          }
        }
      }
    }
  }
`;

const WorkingCommunityFeaturedGalleryBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {
    dataJson,
  } = useStaticQuery<GatsbyTypes.WorkingCommunityFeaturedGalleryQuery>(
    WORKING_COMMUNITY_FEATURED_GALLERY_QUERY,
  );

  invariant(dataJson, 'Working Community JSON data is required');

  const workingCommunityFeaturedGalleryProps = useMemo(() => {
    return {
      title: dataJson.workingCommunityFeaturedGallery.title,
      content: dataJson.workingCommunityFeaturedGallery.content.map((data) => ({
        fluid: data.image.src.fluid,
        alt: data.image.alt,
        category: data.category,
        caption: data.caption,
        links: data.links && data.links.map((link) => link),
      })),
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container sx={{px: [3, 5], pt: [6, 4], pb: [4, 6]}}>
        <FeaturedGallery
          {...workingCommunityFeaturedGalleryProps}
          getCategories={() =>
            workingCommunityFeaturedGalleryProps.content.map(
              ({category}) => category,
            )
          }
        />
      </Container>
    </Section>
  );
};

export default WorkingCommunityFeaturedGalleryBlock;
