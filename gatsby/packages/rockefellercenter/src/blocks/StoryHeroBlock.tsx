/** @jsx jsx */
import {
  jsx,
  Section,
  Container,
  Box,
  IntrinsicImage,
  Text,
  ArrowLink,
  Spacer,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';

const StoryHeroBlock = (
  props: {data: GatsbyTypes.SanityStoryQuery} & ComponentPropsWithoutRef<
    typeof Section
  >,
): JSX.Element => {
  const {data} = props;
  const storyHeroProps = useMemo(() => {
    if (!data) throw new Error('Expected event data');
    if (!data?.story) throw new Error('Expected valid Story data');
    if (!data?.story?.titleAndSlug?.title)
      throw new Error('Expected valid Story title');

    if (!data?.story?.poster?.asset?.fluid)
      throw new Error('Expected valid fluid poster');
    const {fluid} = data.story.poster.asset;
    if (!fluid?.aspectRatio)
      throw new Error('Expected valid fluid poster aspect ratio');
    if (!fluid?.sizes) throw new Error('Expected valid fluid poster sizes');
    if (!fluid?.src) throw new Error('Expected valid fluid poster src');
    if (!fluid?.srcSet) throw new Error('Expected valid fluid poster srcSet');

    if (!data?.story?.formattedPublishAt)
      throw new Error('Expected valid Story publishAt date');
    return {
      title: data.story.titleAndSlug.title,
      authors: data.story.authors,
      formattedPublishAt: data.story.formattedPublishAt,
      fluid: {
        aspectRatio: fluid.aspectRatio,
        base64: fluid.base64,
        sizes: fluid.sizes,
        src: fluid.src,
        srcSet: fluid.srcSet,
        srcSetWebp: fluid.srcSetWebp,
        srcWebp: fluid.srcWebp,
      },
    };
  }, [data]);

  return (
    storyHeroProps && (
      <Section {...props}>
        <Container py={6}>
          <IntrinsicImage
            sx={{mx: 'auto'}}
            ratio={920 / 1000}
            maxWidth={920}
            fluid={storyHeroProps.fluid}
          />
          <Box sx={{textAlign: 'center', py: 4}}>
            <ArrowLink
              href={'/magazine/'}
              reverse
              label="Back to Stories"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                color: 'accentSecondary',
                my: 4,
              }}
            />

            <H
              sx={{
                variant: 'text.heroTitle',
                fontFamily: 'headingSecondary',
                textAlign: 'center',
                mx: 'auto',
                maxWidth: 800,
                my: 4,
              }}
            >
              {storyHeroProps.title}
            </H>
            <Text variant={'storyAuthor'} my={4}>
              {storyHeroProps.authors && storyHeroProps.authors.length > 0 && (
                <Spacer>{`By ${storyHeroProps.authors.join(' & ')}`}</Spacer>
              )}
              <Spacer>{storyHeroProps.formattedPublishAt}</Spacer>
            </Text>
          </Box>
        </Container>
      </Section>
    )
  );
};

export default StoryHeroBlock;
