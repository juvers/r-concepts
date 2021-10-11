/** @jsx jsx */
import {
  jsx,
  Flex,
  Box,
  Text,
  Link,
  Spacer,
  ExternalLinkArrowSvg,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {Fragment} from 'react';

export interface PressListItemProps {
  /** PressListItem Title */
  title: string;
  /** List of bullet separated details (e.g. publish date · source) */
  details: string[];
  /** PressListItem Poster (must be a fluid image) */
  excerpt: string;
  /** PressListItem's links */
  externalLinks: {
    caption: string;
    url: string;
  }[];
  /** PressListItem's published date, as a formatted string */
  formattedPublishAt: string;
}

const PressListItem = ({
  title,
  excerpt,
  details,
  externalLinks,
}: PressListItemProps): JSX.Element => {
  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        alignItems: ['stretch', 'center'],
        flexDirection: ['column', 'row'],
      }}
    >
      <Flex
        sx={{
          flex: ['1 1 auto', '0 0 65%', '0 0 50%'],
          justifyContent: 'space-between',
          alignItems: ['flex-start', 'center'],
          flexDirection: ['column', 'row'],
        }}
      >
        <Box mr={[0, 4]}>
          <H sx={{variant: 'styles.h2', fontFamily: 'headingSecondary', mb: 3}}>
            {title}
          </H>
          <Text mb={4}>
            {details.map((detail, index) => (
              <Spacer key={index}>{detail}</Spacer>
            ))}
          </Text>
        </Box>
      </Flex>
      <Box my={4} ml={[0, 4, 7]} mr={[0, null, 7]}>
        <Text sx={{variant: 'smallP', mb: 4}}>{excerpt}</Text>
        <Flex sx={{alignItems: 'center'}}>
          {externalLinks && externalLinks.length
            ? externalLinks.map(({url, caption}) => (
                <Fragment key={url}>
                  <Link
                    href={url}
                    variant="underline"
                    sx={{
                      mr: externalLinks.length > 1 ? 3 : 0,
                      mb: 3,
                    }}
                  >
                    {caption}
                  </Link>
                  <ExternalLinkArrowSvg
                    sx={{
                      alignSelf: 'flex-start',
                      mt: 1,
                      ml: 2,
                    }}
                  />
                </Fragment>
              ))
            : null}
        </Flex>
      </Box>
    </Flex>
  );
};

export default PressListItem;
