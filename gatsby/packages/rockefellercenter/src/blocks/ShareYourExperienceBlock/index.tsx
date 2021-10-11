/** @jsx jsx */
import {useMemo, Fragment, useState, useCallback} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {
  jsx,
  Spinner,
  Flex,
  Section,
  useTradableBits,
  SocialCarousel,
  TradableBitsProps,
  ModalSocialCarousel,
  ThemeProvider,
  getThemeByName,
  Modal,
} from '@tishman/components';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import ShareYourExperienceBlockHeader, {
  ShareYourExperienceBlockHeaderProps,
} from './ShareYourExperienceBlockHeader';

import ErrorMessage from './ErrorMessage';

import type {ComponentPropsWithoutRef} from 'react';
import type {
  SocialCarouselCardProps,
  ModalSocialCarouselCardProps,
} from '@tishman/components';

type CardProps = SocialCarouselCardProps & ModalSocialCarouselCardProps;

const ShareYourExperienceCarousel = ({
  labels = ['rockcenter', 'topoftherock', 'rainbowroom'],
  maxItems = 20,
  network = ['twitter', 'instagram'],
}: TradableBitsProps): JSX.Element => {
  const data = useTradableBits({
    labels,
    maxItems,
    network,
  });

  const cards = useMemo(() => {
    if (!data) return null;
    return data.reduce<CardProps[]>((acc, d) => {
      if (!d) throw new Error('Expected valid Tradable Bits data');
      if (!d.record_key) {
        console.error('Expected valid Tradable Bits record key');
        return acc;
      }
      if (!d.caption) {
        console.error(
          'Expected valid Tradable Bits caption, record_key: ' + d.record_key,
        );
        return acc;
      }
      if (!d.image_url) {
        console.error(
          'Expected valid Tradable Bits image, record_key: ' + d.record_key,
        );
        return acc;
      }
      if (!d.creation_timestamp) {
        console.error(
          'Expected valid Tradable Bits creation time, record_key: ' +
            d.record_key,
        );
        return acc;
      }
      acc.push({
        id: d.record_key,
        caption: d.caption,
        image: d.image_url,
        url: d.record_url,
        // authorImage is not always included
        authorImage: d.author_image_url,
        authorScreenName: d.author_screen_name,
        creation_timestamp: format(
          fromUnixTime(d.creation_timestamp),
          'M/d/yy',
        ),
      });
      return acc;
    }, []);
  }, [data]);

  const [modalId, openModal] = useState<string | null>(null);

  const initialModalCardIndex = cards?.findIndex((card) => card.id === modalId);

  const closeModal = useCallback(() => openModal(null), []);

  return cards ? (
    <Fragment>
      <SocialCarousel cards={cards} onActiveCardChange={openModal} />
      <ThemeProvider theme={getThemeByName('Rock Center')}>
        <Modal isOpen={modalId !== null} onClose={closeModal}>
          <ModalSocialCarousel
            cards={cards}
            initialModalCardIndex={initialModalCardIndex ?? 0}
            closeModal={closeModal}
          />
        </Modal>
      </ThemeProvider>
    </Fragment>
  ) : (
    <Spinner sx={{display: 'block', m: ['100px auto', '160px auto']}} />
  );
};

const ShareYourExperienceBlock = ({
  title,
  hashTags,
  labels,
  maxItems,
  network,
  ...props
}: ShareYourExperienceBlockHeaderProps &
  TradableBitsProps &
  Omit<ComponentPropsWithoutRef<typeof Section>, 'children'>): JSX.Element => {
  return (
    <Section {...props}>
      <Flex
        sx={{
          flexDirection: 'column',
          position: 'relative',
          bg: 'background',
          color: 'text',
          pt: [6, 7],
          pb: 7,
        }}
      >
        <ShareYourExperienceBlockHeader title={title} hashTags={hashTags} />
        <ErrorBoundary FallbackComponent={ErrorMessage}>
          <ShareYourExperienceCarousel
            labels={labels}
            maxItems={maxItems}
            network={network}
          />
        </ErrorBoundary>
      </Flex>
    </Section>
  );
};

export default ShareYourExperienceBlock;
