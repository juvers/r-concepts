/** @jsx jsx */
import {
  jsx,
  Box,
  Flex,
  Grid,
  Link,
  Text,
  IntrinsicImage,
  IntrinsicImageProps,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';

export type CUSTOM_CALLOUT_CARD_TYPES =
  | 'HOLIDAY_MR'
  | 'HOLIDAY_ML'
  | 'HOLIDAY_NARROW'
  | 'HOLIDAY_FULL_WIDTH_NARROW'
  | 'RINK_TOP'
  | 'RINK_BOTTOM'
  | 'LAST_CARD';

const getCustomCardStyles = (customCardType?: CUSTOM_CALLOUT_CARD_TYPES) => {
  switch (customCardType) {
    case 'HOLIDAY_MR':
      return {mr: [4, 0]};
    case 'HOLIDAY_ML':
      return {ml: [6]};
    case 'HOLIDAY_NARROW':
      return {ml: [7]};
    case 'HOLIDAY_FULL_WIDTH_NARROW':
      return {
        gridColumn: '1 / -1',
        mx: 'auto',
        mt: [4, null, 9],
        mb: [3, null, 3],
      };
    case 'RINK_TOP':
      return {mr: [4, 6]};
    case 'RINK_BOTTOM':
      return {mr: [8], mb: [0, null, 0]};
    case 'LAST_CARD':
      return {height: ['auto', 'auto', 220]};
    default:
      return {};
  }
};

export interface CalloutGridCardProps extends IntrinsicImageProps {
  /** Grid card index
   * this informs if card is on right or left side
   *  */
  index: number;
  /** Grid card title */
  title: string;
  /** Grid card caption */
  caption?: string;
  align?: string;
  /** Grid card description */
  description: string;
  /** Grid card alt */
  alt: string;
  /** Grid card links */
  links?: readonly {
    url: string;
    label: string;
  }[];
  customCardType?: CUSTOM_CALLOUT_CARD_TYPES;
}

export const CalloutGridCard = ({
  index,
  title,
  caption,
  fluid,
  description,
  alt,
  links,
  ratio = 520 / 490,
  maxWidth = 520,
  customCardType,
}: CalloutGridCardProps): JSX.Element => {
  const evenCard = index % 2 === 0;
  return (
    <Box
      sx={{
        maxWidth: maxWidth,
        mb: [5, 7],
        mr: evenCard ? 5 : 0,
        ml: evenCard ? 0 : 5,
        ...getCustomCardStyles(customCardType),
      }}
    >
      <Box sx={{position: 'relative'}}>
        <IntrinsicImage
          ratio={ratio}
          maxWidth={maxWidth}
          fluid={fluid}
          alt={alt}
        />
        {caption && (
          <Text
            sx={{
              position: 'absolute',
              fontSize: [1, 2],
              bottom: [2, 3],
              right: [2, 3],
              color: 'mediaCaption',
              zIndex: 5,
            }}
          >
            {caption}
          </Text>
        )}
      </Box>
      <Box my={[3, 4]} mx={[3, 4]} sx={{direction: 'ltr'}}>
        <H
          sx={{
            mb: [2, 3],
            variant: 'styles.h2',
            fontFamily: 'headingSecondary',
          }}
        >
          {title}
        </H>
        <Text>{description}</Text>
        <Flex mt={[3, 4]}>
          {links &&
            links.length > 0 &&
            links.map(({url, label}) => (
              <Link
                variant={'underline'}
                sx={{
                  ':first-of-type': {
                    mr: links.length > 1 ? 3 : 0,
                  },
                }}
                key={url}
                href={url}
              >
                {label}
              </Link>
            ))}
        </Flex>
      </Box>
    </Box>
  );
};

export const CalloutGridCardFull = ({
  title,
  caption,
  description,
  fluid,
  alt,
  links,
  ratio = [285 / 200, null, 1140 / 490],
  className,
  sx,
}: Omit<CalloutGridCardProps, 'index'>): JSX.Element => {
  return (
    <Box
      sx={{
        mb: 4,
        width: '100%',
        ...sx,
      }}
      className={className}
    >
      <Box sx={{position: 'relative'}}>
        <IntrinsicImage ratio={ratio} fluid={fluid} alt={alt} />
        {caption && (
          <Text
            sx={{
              position: 'absolute',
              fontSize: [1, 2],
              bottom: [2, 3],
              right: [2, 3],
              color: 'mediaCaption',
              zIndex: 5,
            }}
          >
            {caption}
          </Text>
        )}
      </Box>
      <Flex
        sx={{
          mt: [3, null, 6],
          mb: [3, null, 4],
          mx: [2, 3],
          flexDirection: ['column', null, 'row'],
        }}
      >
        <H
          sx={{
            variant: 'styles.h2',
            fontSize: [5, null, 7],
            flex: ['none', null, '0 0 50%'],
            mr: 3,
            fontFamily: 'headingSecondary',
            my: [2, 2, 0],
          }}
        >
          {title}
        </H>
        <Box sx={{flex: ['none', null, '1 1 auto']}}>
          <Text>{description}</Text>
          <Flex mt={3}>
            {links &&
              links.map(({url, label}) => (
                <Link
                  variant={'underline'}
                  sx={{
                    ':first-of-type': {
                      mr: links.length > 1 ? 3 : 0,
                    },
                  }}
                  key={url}
                  href={url}
                >
                  {label}
                </Link>
              ))}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
export const CalloutGridCardFullWidth = ({
  title,
  description,
  fluid,
  alt,
  links,
  align,
  ratio = [285 / 200, null, 1000 / 490],
  className,
  sx,
}: Omit<CalloutGridCardProps, 'index'>): JSX.Element => {
  return (
    <Box
      sx={{
        width: '100%',
        ...sx,
      }}
      className={className}
    >
      <Grid
        gap={0}
        columns={['1fr', '1fr 400px', '1fr 400px 10%']}
        sx={{
          alignItems: 'center',
          gridAutoFlow: 'dense',
          direction: align == 'right' ? 'rtl' : 'ltr',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
          }}
        >
          <IntrinsicImage ratio={ratio} fluid={fluid} alt={alt} />
        </Box>
        <Box
          sx={{padding: '32px', pt: ['24px', null, '32px'], textAlign: 'left'}}
        >
          <H
            sx={{
              mb: [2, 3],
              variant: 'styles.h2',
              fontFamily: 'headingSecondary',
            }}
          >
            {title}
          </H>
          <Text>{description}</Text>
          <Flex
            mt={3}
            sx={{
              direction: 'ltr',
            }}
          >
            {links &&
              links.map(({url, label}) => (
                <Link
                  variant={'underline'}
                  sx={{
                    ':first-of-type': {
                      mr: links.length > 1 ? 3 : 0,
                    },
                  }}
                  key={url}
                  href={url}
                >
                  {label}
                </Link>
              ))}
          </Flex>
        </Box>
      </Grid>
    </Box>
  );
};

export type ImageGridCardProps = Omit<
  CalloutGridCardProps,
  'title' | 'links' | 'index' | 'caption' | 'description'
> & {
  caption?: string;
};
export const ImageGridCard = ({
  fluid,
  caption,
  alt,
  ratio = 395 / 565,
  maxWidth = 395,
  className,
  sx,
}: ImageGridCardProps): JSX.Element => {
  return (
    <Box
      sx={{
        width: ['75%', '100%'],
        maxWidth: maxWidth,
        position: 'relative',
        ...sx,
      }}
      className={className}
    >
      <IntrinsicImage
        ratio={ratio}
        maxWidth={maxWidth}
        fluid={fluid}
        alt={alt}
      />
      {caption && (
        <Text
          sx={{
            position: 'absolute',
            fontSize: [1, 2],
            bottom: [2, 3],
            right: [2, 3],
            color: 'mediaCaption',
          }}
        >
          {caption}
        </Text>
      )}
    </Box>
  );
};
