/**@jsx jsx */
import {useMemo} from 'react';
import {jsx, WideCta, Container, Section} from '@tishman/components';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const StoryWideCtaBlock = (
  props: {data: GatsbyTypes.SanityStoryQuery} & ComponentPropsWithoutRef<
    typeof Section
  >,
): JSX.Element => {
  const {dataJson} = props.data;

  invariant(dataJson, 'Story JSON data is required!');

  const storyWideCtaProps = useMemo(() => {
    return {
      title: dataJson.wideCta.title,
      caption: dataJson.wideCta.caption,
      link: dataJson.wideCta.link,
    };
  }, [dataJson]);

  return (
    storyWideCtaProps && (
      <Section {...props}>
        <Container sx={{py: [5, null, 8]}}>
          <WideCta {...storyWideCtaProps} />
        </Container>
      </Section>
    )
  );
};

export default StoryWideCtaBlock;
