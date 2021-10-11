/**@jsx jsx */
import {
  jsx,
  Container,
  Box,
  Text,
  Section,
  Link,
  Flex,
} from '@tishman/components';
import {useMemo} from 'react';
import {useLocation} from '@reach/router';
import type {ComponentPropsWithoutRef} from 'react';
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';

const StoryShareBlock = (
  props: {data: GatsbyTypes.SanityStoryQuery} & ComponentPropsWithoutRef<
    typeof Section
  >,
): JSX.Element => {
  const {data} = props;

  const storyShareProps = useMemo(() => {
    if (!data?.story?.titleAndSlug?.title)
      throw new Error('Expected valid Story title');
    if (!data?.story?.excerpt) throw new Error('Expected valid Story excerpt');
    return {
      title: data.story.titleAndSlug.title,
      excerpt: data.story.excerpt,
    };
  }, [data]);

  const {href} = useLocation();
  return (
    <Section {...props} sx={{py: [5, null, 8]}}>
      <Container sx={{textAlign: 'center'}}>
        <Box sx={{my: [3, 6]}}>
          <Text variant="smallP">Share this Story:</Text>
          <Flex sx={{justifyContent: 'center'}}>
            <EmailShareButton
              url={href}
              subject={`Check this out: ${storyShareProps.title}`}
            >
              <EmailIcon bgStyle={{fill: 'none'}} iconFillColor={'#000000'} />
            </EmailShareButton>
            <FacebookShareButton
              url={href}
              quote={storyShareProps.excerpt}
              hashtag="#rockcenter"
            >
              <FacebookIcon
                bgStyle={{fill: 'none'}}
                iconFillColor={'#000000'}
              />
            </FacebookShareButton>
            <TwitterShareButton
              url={href}
              title={storyShareProps.title}
              via="@rockcenternyc"
              hashtags={['rockcenter']}
            >
              <TwitterIcon bgStyle={{fill: 'none'}} iconFillColor={'#000000'} />
            </TwitterShareButton>
          </Flex>
        </Box>
        <Box sx={{my: [3, 6]}}>
          <Link
            variant="buttonBorder"
            sx={{display: 'inline-block'}}
            href={'/magazine/'}
          >
            Back to all Stories
          </Link>
        </Box>
      </Container>
    </Section>
  );
};

export default StoryShareBlock;
