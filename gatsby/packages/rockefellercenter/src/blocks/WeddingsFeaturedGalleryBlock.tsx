/**@jsx jsx */
import {
  jsx,
  FeaturedGallery,
  Container,
  AnchorSection,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import IntroText from '~components/IntroText';
import invariant from 'invariant';

const WEDDINGS_FEATURED_GALLERY_QUERY = graphql`
  query WeddingFeaturedGallery {
    dataJson(id: {eq: "wedding"}) {
      weddingFeaturedGallery {
        introHeading
        introCopy
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

const WeddingsFeaturedGalleryBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.WeddingFeaturedGalleryQuery>(
    WEDDINGS_FEATURED_GALLERY_QUERY,
  );

  invariant(dataJson, 'Wedding JSON data is required!');

  const weddingFeaturedGalleryProps = useMemo(() => {
    return {
      title: dataJson.weddingFeaturedGallery.title,
      introHeading: dataJson.weddingFeaturedGallery.introHeading,
      introCopy: dataJson.weddingFeaturedGallery.introCopy,
      content: dataJson.weddingFeaturedGallery.content.map((data) => ({
        fluid: data.image.src.fluid,
        alt: data.image.alt,
        category: data.category,
        caption: data.caption,
        links: data.links && data.links.map((link) => link),
      })),
    };
  }, [dataJson]);

  return (
    weddingFeaturedGalleryProps && (
      <AnchorSection {...props}>
        <Container sx={{px: 3, py: 6}}>
          <IntroText
            title={weddingFeaturedGalleryProps.introHeading}
            caption={weddingFeaturedGalleryProps.introCopy}
            desktopOrientation="row"
            sx={{py: 4}}
          />
          <FeaturedGallery
            {...weddingFeaturedGalleryProps}
            getCategories={() =>
              weddingFeaturedGalleryProps.content.map(({category}) => category)
            }
          />
        </Container>
      </AnchorSection>
    )
  );
};

export default WeddingsFeaturedGalleryBlock;
