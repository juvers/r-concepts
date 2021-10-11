/**@jsx jsx */
import {
  jsx,
  Box,
  Text,
  Flex,
  ArrowLink,
  Section,
  Container,
  IntrinsicImage,
  SanityRichText,
} from '@tishman/components';
import {useMemo} from 'react';
import {getSanityFluidImageProps} from '~blocks/utils';
import {H} from '@hzdg/sectioning';

import type {Block} from '@sanity/block-content-to-react';

const ExecutiveDetailPageBlock = ({
  data,
}: {
  data: GatsbyTypes.sanityExecutiveQuery;
}): JSX.Element => {
  const {name, title, bio, alt, fluid} = useMemo(() => {
    if (!data?.executive) throw new Error('Expected executive data object');
    if (!data?.executive?.name) throw new Error('Expected an executive name');
    if (!data?.executive?.title) throw new Error('Expected an executive title');
    if (!data?.executive?.bio) throw new Error('Expected an executive bio');
    const image = getSanityFluidImageProps(data?.executive?.image);

    return {
      name: data.executive.name,
      title: data.executive.title,
      bio: data.executive.bio,
      ...image,
    };
  }, [data]);

  return (
    <Section>
      <Container>
        <Flex sx={{flexDirection: ['column-reverse', 'row'], my: [5, 6]}}>
          <Box sx={{mr: [0, 5], maxWidth: 524, pr: [0, 7]}}>
            <ArrowLink
              variant="backArrow"
              href="/executive-team"
              label="Back to Executive Team"
            />
            <H
              sx={{
                variant: 'styles.h1',
                fontFamily: 'headingSecondary',
                mt: 4,
                mb: 3,
              }}
            >
              {name}
            </H>
            <Text sx={{variant: 'text.executiveTitle', mb: 3}}>{title}</Text>
            <SanityRichText blocks={(bio as unknown) as Block} />
          </Box>
          <Box sx={{width: '100%', mb: 4}}>
            <IntrinsicImage
              ratio={[272 / 181, 539 / 359]}
              alt={alt}
              fluid={fluid}
            />
          </Box>
        </Flex>
      </Container>
    </Section>
  );
};

export default ExecutiveDetailPageBlock;
