/** @jsx jsx */
import {jsx, Container, Text, Divider} from '@tishman/components';
import {useMemo} from 'react';
import {getSanityFluidImageProps} from '~blocks/utils';
import Podcast from '~components/podcast';

const EventSponsorBlock = ({
  data,
}: {
  data: GatsbyTypes.sanityEventQuery;
}): JSX.Element | null => {
  const eventPodcastProps = useMemo(() => {
    if (!data) throw new Error('Expected event data');
    if (!data?.event) throw new Error('Expected valid event data');
    if (!data.event?.podcast) return null;
    const {podcast} = data.event;
    if (!podcast?.titleAndSlug?.title)
      throw new Error('Expected valid event podcast title');
    if (!podcast?.category)
      throw new Error('Expected valid event podcast category');
    if (!podcast?.authors || !podcast.authors.length)
      throw new Error('Expected valid event podcast authors');
    if (!podcast?.excerpt)
      throw new Error('Expected valid event podcast excerpt');
    if (!podcast?.poster)
      throw new Error('Expected valid event podcast poster');
    if (!data.event?.podcast?.podcastSource)
      throw new Error('Expected valid event podcast sources');
    const authors = podcast.authors.filter(
      (author) => typeof author === 'string',
    );
    const poster = getSanityFluidImageProps(podcast.poster);
    return {
      title: podcast.titleAndSlug.title,
      category: podcast.category,
      authors: authors,
      excerpt: podcast.excerpt,
      poster: poster,
      appleLink: podcast.podcastSource?.apple,
      spotifyLink: podcast.podcastSource?.spotify,
      audibleLink: podcast.podcastSource?.audible,
    };
  }, [data]);

  return (
    eventPodcastProps && (
      <Container my={5}>
        <Divider my={5} />
        <Text variant="categoryEyebrow">
          For more information, listen here:
        </Text>
        <Podcast {...eventPodcastProps} />
      </Container>
    )
  );
};

export default EventSponsorBlock;
