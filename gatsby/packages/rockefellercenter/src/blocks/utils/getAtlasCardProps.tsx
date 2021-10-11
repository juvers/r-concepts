import {AtlasCardProps} from '@tishman/components';
import {getSanityFluidImageProps} from '~blocks/utils';
import {getStoryDetailUri} from '~blocks/utils';

export const getAtlasCardProps = (card?: {
  excerpt?: string;
  titleAndSlug?: Partial<
    Omit<GatsbyTypes.SanityTitleAndSlug, '_key' | '_type'>
  >;
  category?: string;
  formattedPublishAt?: string;
  poster?: Partial<Omit<GatsbyTypes.SanityImageType, 'asset'>> & {
    asset?: {
      fluid?: GatsbyTypes.GatsbySanityImageFluidFragment;
    };
  };
}): Omit<AtlasCardProps, 'useHoverAnimation'> => {
  if (!card) throw new Error('Expected valid story data');
  if (!card.titleAndSlug)
    throw new Error('Expected valid story title and slug');
  if (!card.titleAndSlug.title) throw new Error('Expected valid story title');
  if (!card.excerpt) throw new Error('Expected valid story excerpt');
  if (!card.category) throw new Error('Expected valid story category');
  if (!card.formattedPublishAt)
    throw new Error('Expected valid story publish date');
  if (!card?.titleAndSlug.slug?.current)
    throw new Error('Expected valid story slug');
  if (!card.poster?.asset?.fluid)
    throw new Error('Expected valid fluid poster');
  const fluidImageProps = getSanityFluidImageProps(card.poster);

  return {
    title: card.titleAndSlug.title,
    excerpt: card.excerpt,
    url: getStoryDetailUri(card),
    alt: fluidImageProps.alt,
    fluid: fluidImageProps.fluid,
    category: card.category,
    formattedPublishAt: card.formattedPublishAt,
  };
};
