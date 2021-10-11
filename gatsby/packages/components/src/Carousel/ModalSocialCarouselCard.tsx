/** @jsx jsx */
import {
  jsx,
  Flex,
  Box,
  Link,
  Text,
  IntrinsicImage,
  ExternalLinkArrowSvg,
} from '@tishman/components';

export interface ModalSocialCarouselCardProps {
  id: string;
  caption: string;
  image: string;
  authorScreenName?: string;
  authorImage?: string;
  url?: string;
  creation_timestamp: string;
}

export const ModalSocialCarouselCard = ({
  image,
  caption,
  authorImage,
  authorScreenName,
  creation_timestamp,
  url,
}: ModalSocialCarouselCardProps): JSX.Element => {
  return (
    <Box sx={{width: '100%'}}>
      <IntrinsicImage
        ratio={515 / 350}
        fluid={{
          aspectRatio: 350 / 515,
          src: image,
          sizes: `320px`,
          srcSet: image,
        }}
        alt={caption}
      />
      <Box m={[4, null, 6]}>
        <Flex sx={{alignItems: 'center', mb: 3}}>
          {typeof authorImage === 'string' ? (
            <IntrinsicImage
              ratio={1}
              minWidth={55}
              maxWidth={55}
              sx={{mr: 3, borderRadius: '50%', bg: 'backgroundDisabled'}}
              imgStyle={{borderRadius: '50%'}}
              fluid={{
                aspectRatio: 1,
                src: authorImage,
                sizes: `320px`,
                srcSet: authorImage,
              }}
              alt={caption}
            />
          ) : null}

          <Box>
            {authorScreenName && (
              <Text variant="smallP" sx={{fontWeight: 'medium'}}>
                @{authorScreenName}
              </Text>
            )}
            <Text variant="smallP">{creation_timestamp}</Text>
          </Box>
        </Flex>
        <Text mt={4} mb={5}>
          {caption}
        </Text>
        <Flex>
          {url && (
            <Flex sx={{alignItems: 'center'}}>
              <Link variant="underline" href={url}>
                Source
              </Link>
              <ExternalLinkArrowSvg sx={{ml: 2, height: 19, width: 19}} />
            </Flex>
          )}
        </Flex>
      </Box>
    </Box>
  );
};
