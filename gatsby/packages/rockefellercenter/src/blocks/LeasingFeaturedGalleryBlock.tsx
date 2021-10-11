/**@jsx jsx */
import {jsx, FeaturedGallery, Container, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const LEASING_FEATURED_GALLERY_QUERY = graphql`
  query LeasingFeaturedGallery {
    dataJson(id: {eq: "leasing"}) {
      featuredGallery {
        title
        content {
          category
          caption
          image {
            src {
              fluid(maxWidth: 1300) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
            alt
          }
        }
      }
    }
  }
`;

const LeasingFeaturedGalleryBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.LeasingFeaturedGalleryQuery>(
    LEASING_FEATURED_GALLERY_QUERY,
  );

  invariant(dataJson, 'Leasing JSON data is required!');

  const leasingFeaturedGalleryProps = useMemo(() => {
    return {
      title: dataJson.featuredGallery.title,
      content: dataJson.featuredGallery.content.map((data) => ({
        fluid: data.image.src.fluid,
        alt: data.image.alt,
        category: data.category,
        caption: data.caption,
      })),
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Container
        sx={{
          py: 0,
          px: [0, 0, 0, 0],
          maxWidth: '1280px',
        }}
      >
        <FeaturedGallery
          {...leasingFeaturedGalleryProps}
          getCategories={() =>
            leasingFeaturedGalleryProps.content.map(({category}) => category)
          }
          sx={{
            ...{
              'h1, h2, h3, h4, h5, h6': {
                flex: ['none', '0 0 36%', '0 0 36%'],
                fontSize: [5, 7, 7],
                pb: [0, 3, 0],
              },
              '> div[class*="FeaturedGallery"]': {
                maxWidth: 1110,
                mx: 'auto',
                px: [3, 3, 0, 0],
              },
            },
          }}
        />
      </Container>
    </Section>
  );
};

export default LeasingFeaturedGalleryBlock;
