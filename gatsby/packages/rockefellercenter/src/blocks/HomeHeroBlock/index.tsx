/** @jsx jsx */
import {useMemo} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import {jsx, Section} from '@tishman/components';
import HomeHero from '~components/home-hero';
import invariant from 'invariant';

import type {ComponentPropsWithoutRef} from 'react';

const HOME_HERO_QUERY = graphql`
  query HomeHero {
    sanityHomePage {
      headline
      media {
        image {
          alt
          asset {
            fluid(maxWidth: 2500) {
              srcWebp
              srcSetWebp
              aspectRatio
              src
              srcSet
              sizes
            }
          }
        }
        video {
          videoFile {
            asset {
              title
              url
            }
          }
        }
      }
    }
  }
`;

const HomeHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {sanityHomePage} = useStaticQuery<GatsbyTypes.HomeHeroQuery>(
    HOME_HERO_QUERY,
  );

  invariant(sanityHomePage, 'Home page JSON data is required!');

  const {headline, media} = sanityHomePage;

  invariant(headline, 'A home page headline is required');

  invariant(media, 'A home page image or video is required');

  const {image, video} = media;

  invariant(
    (video && video.videoFile) || (image && image.asset),
    'A video or image for the home page hero is required',
  );

  invariant(
    !(video && video.videoFile && image && image.asset),
    'A video or image for the home page hero is required, but not both.',
  );

  image &&
    image.asset &&
    invariant(image.alt, 'An alt tag is required for the hero image');

  const homeHeroProps = useMemo(() => {
    return {
      title: headline,
      image: image,
      video: video,
    };
  }, [headline, image, video]);

  return (
    homeHeroProps && (
      <Section {...props}>
        <HomeHero {...homeHeroProps} />
      </Section>
    )
  );
};

export default HomeHeroBlock;
