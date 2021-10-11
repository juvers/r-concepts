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

const WEDDINGS_FEATURED_GALLERY_2_QUERY = graphql`
  query WeddingFeaturedGallery2 {
    dataJson(id: {eq: "wedding"}) {
      weddingFeaturedGallery2 {
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

const WeddingsFeaturedGalleryTwoBlock = (
  props: ComponentPropsWithoutRef<typeof AnchorSection>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.WeddingFeaturedGallery2Query>(
    WEDDINGS_FEATURED_GALLERY_2_QUERY,
  );

  invariant(dataJson, 'Wedding JSON data is required!');

  const weddingFeaturedGallery2Props = useMemo(() => {
    return {
      title: dataJson.weddingFeaturedGallery2.title,
      introHeading: dataJson.weddingFeaturedGallery2.introHeading,
      introCopy: dataJson.weddingFeaturedGallery2.introCopy,
      content: dataJson.weddingFeaturedGallery2.content.map((data) => ({
        fluid: data.image.src.fluid,
        alt: data.image.alt,
        category: data.category,
        caption: data.caption,
        links: data.links && data.links.map((link) => link),
      })),
    };
  }, [dataJson]);

  return (
    weddingFeaturedGallery2Props && (
      <AnchorSection {...props}>
        <Container sx={{px: 3, py: 6}}>
          <IntroText
            title={weddingFeaturedGallery2Props.introHeading}
            caption={weddingFeaturedGallery2Props.introCopy}
            desktopOrientation="row"
            sx={{py: 4}}
          />
          <FeaturedGallery
            {...weddingFeaturedGallery2Props}
            getCategories={() =>
              weddingFeaturedGallery2Props.content.map(({category}) => category)
            }
          />
        </Container>
      </AnchorSection>
    )
  );
};

export default WeddingsFeaturedGalleryTwoBlock;
