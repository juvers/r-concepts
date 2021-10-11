/** @jsx jsx */
import {
  jsx,
  Container,
  Text,
  SanityRichTextProps,
  RichTextProps,
  ImageContentsBlockProps,
  GalleryProps,
  GalleryCarousel,
  ReviewCarouselCard,
  QuoteProps,
  IntrinsicBox,
  VideoProps,
} from '@tishman/components';
import {ImageContentsBlock} from '~components/ImageContentsBlock';
import {H} from '@hzdg/sectioning';
import {getFluidGatsbyImage} from 'gatsby-source-sanity';
import {SANITY_DATASET, SANITY_PROJECT_ID} from '~environment';

const headingStyles = {
  fontFamily: 'headingSecondary',
  mt: 4,
  mb: 3,
};
const containerStyles = {
  maxWidth: 850,
};

const StoryH1 = ({children}: RichTextProps): JSX.Element => {
  return (
    <Container sx={containerStyles}>
      <H
        sx={{
          variant: 'styles.h1',
          ...headingStyles,
        }}
      >
        {children}
      </H>
    </Container>
  );
};

const StoryH2 = ({children}: RichTextProps): JSX.Element => {
  return (
    <Container sx={containerStyles}>
      <H
        sx={{
          variant: 'styles.h2',
          ...headingStyles,
        }}
      >
        {children}
      </H>
    </Container>
  );
};

const StoryH3 = ({children}: RichTextProps): JSX.Element => {
  return (
    <Container sx={containerStyles}>
      <H
        sx={{
          variant: 'styles.h3',
          ...headingStyles,
        }}
      >
        {children}
      </H>
    </Container>
  );
};

const StoryH4 = ({children}: RichTextProps): JSX.Element => {
  return (
    <Container sx={containerStyles}>
      <H
        sx={{
          variant: 'styles.h4',
          ...headingStyles,
        }}
      >
        {children}
      </H>
    </Container>
  );
};

const StoryH5 = ({children}: RichTextProps): JSX.Element => {
  return (
    <Container sx={containerStyles}>
      <H
        sx={{
          variant: 'styles.h5',
          ...headingStyles,
        }}
      >
        {children}
      </H>
    </Container>
  );
};

const StoryP = ({children}: RichTextProps): JSX.Element => {
  return (
    <Container sx={containerStyles}>
      <Text as="p" variant="mediumP" mb={2}>
        {children}
      </Text>
    </Container>
  );
};

const StoryUl = ({children}: RichTextProps): JSX.Element => {
  return (
    <Container sx={containerStyles}>
      <ul sx={{listStyle: 'disc', pl: 3, my: 4}}>{children}</ul>
    </Container>
  );
};

const StoryOl = ({children}: RichTextProps): JSX.Element => {
  return (
    <Container sx={containerStyles}>
      <ol sx={{listStyle: 'decimal', pl: 3, my: 4}}>{children}</ol>
    </Container>
  );
};

const StoryLi = ({children}: RichTextProps): JSX.Element => {
  return <li sx={{variant: 'text.mediumP'}}>{children}</li>;
};
const StoryImageContentsBlock = ({
  node,
}: ImageContentsBlockProps): JSX.Element => {
  const fluid = getFluidGatsbyImage(
    node.photo.asset._ref,
    {maxWidth: 1024},
    {
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
    },
  );
  if (!fluid) throw new Error('missing ImageContentsBlock fluid image');
  return (
    <ImageContentsBlock
      {...node}
      fluid={fluid}
      blocks={node.contents}
      align={node.photo.align}
      alt={node.photo.alt}
      caption={node.photo.caption}
    />
  );
};

const StoryGalleryBlock = ({node}: GalleryProps): JSX.Element => {
  const cards = node.items.map((item) => {
    const fluid = getFluidGatsbyImage(
      item.asset._ref,
      {maxWidth: 1024},
      {
        projectId: SANITY_PROJECT_ID,
        dataset: SANITY_DATASET,
      },
    );
    if (!fluid) throw new Error('missing sanity gallery fluid image');
    return {
      fluid: fluid,
      alt: item.alt,
      caption: item.caption,
    };
  });
  return <GalleryCarousel cards={cards} sx={{my: [6, 8]}} />;
};

const StoryQuoteBlock = ({node}: QuoteProps): JSX.Element => {
  return (
    <Container sx={{...containerStyles, my: [6, 8]}}>
      <ReviewCarouselCard quote={node.body} author={node.author} />
    </Container>
  );
};

/**
 * Get Vimeo ID from various Vimeo URL
 */
function getVimeoId(url: string): string {
  const vimeoRegex = /([0-9a-z\-_]+)$/i;
  return vimeoRegex.exec(url)?.[0] ?? 'Invalid vimeo id';
}

const StoryVimeoBlock = ({node}: VideoProps): JSX.Element => {
  const vimeoId = getVimeoId(node.url);
  return (
    <IntrinsicBox ratio={1280 / 680} sx={{my: [6, 8], position: 'relative'}}>
      <iframe
        title={`vimeo iframe ${vimeoId}`}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        src={`https://player.vimeo.com/video/${vimeoId}`}
      ></iframe>
    </IntrinsicBox>
  );
};

/**
 * Get YouTube ID from various YouTube URL
 */
function getYoutubeId(url: string): string {
  const urlArray = url
    .replace(/(>|<)/gi, '')
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  return urlArray[2] !== undefined
    ? urlArray[2].split(/[^0-9a-z_-]/i)[0]
    : urlArray[0];
}

const StoryYoutubeBlock = ({node}: VideoProps): JSX.Element => {
  const youtubeId = getYoutubeId(node.url);
  return (
    <IntrinsicBox ratio={1280 / 680} sx={{my: [6, 8], position: 'relative'}}>
      <iframe
        title={`youtube iframe ${youtubeId}`}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        src={`https://www.youtube.com/embed/${youtubeId}`}
      ></iframe>
    </IntrinsicBox>
  );
};

export const storyComponents: SanityRichTextProps['components'] = {
  h1: StoryH1,
  h2: StoryH2,
  h3: StoryH3,
  h4: StoryH4,
  h5: StoryH5,
  p: StoryP,
  ul: StoryUl,
  ol: StoryOl,
  li: StoryLi,
  imageContentsBlock: StoryImageContentsBlock,
  galleryBlock: StoryGalleryBlock,
  quoteBlock: StoryQuoteBlock,
  vimeoBlock: StoryVimeoBlock,
  youtubeBlock: StoryYoutubeBlock,
};
