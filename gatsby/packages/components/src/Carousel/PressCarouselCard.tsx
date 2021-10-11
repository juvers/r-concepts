/** @jsx jsx */
import {
  jsx,
  Box,
  Text,
  Link,
  Flex,
  ZagatIconSvg,
  BridesIconSvg,
  NycGoIconSvg,
  CondeNastIconSvg,
  BtsqIconSvg,
} from '@tishman/components';

export interface PressCarouselCardProps {
  excerpt: string;
  source: string;
  links?: {
    label: string;
    url: string;
  }[];
}

interface Map {
  [key: string]: React.ReactNode | null;
}

const icons: Map = {
  'NYCGo.com': <NycGoIconSvg sx={{mr: 3, maxWidth: 150, maxHeight: 68}} />,
  'Food & Wine': null,
  'Conde Nast Traveler': <CondeNastIconSvg sx={{mr: 3, mb: '8px'}} />,
  Zagat: <ZagatIconSvg sx={{mr: 3, maxWidth: 187}} />,
  Brides: <BridesIconSvg sx={{mr: 3, maxWidth: 145, maxHeight: 51}} />,
  'Beyond Times Square': <BtsqIconSvg sx={{mr: 3}} />,
};

/**
 * `PressCarouselCard` displays quotes from press
 * outlets and links to the full articles.
 *
 * @see https://tishman.netlify.app/components/carousel
 */

export function PressCarouselCard({
  excerpt,
  links,
  source,
}: PressCarouselCardProps): JSX.Element {
  return (
    <Box>
      <Flex
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'flex-end'],
          mb: [5, 6],
        }}
      >
        {icons[source]}
        <Text
          sx={{
            variant: 'text.body',
            fontSize: [2, 5],
            letterSpacing: 1,
            fontWeight: 'medium',
            mb: 0,
          }}
        >
          Via {source}
        </Text>
      </Flex>
      <Box sx={{maxWidth: 900}}>
        <Text
          sx={{
            variant: 'text.heading',
            fontFamily: 'headingSecondary',
            color: 'text',
            fontSize: [6, 8],
            letterSpacing: 0,
            mb: 4,
          }}
        >
          {excerpt}
        </Text>
        <Flex sx={{flexWrap: 'wrap'}}>
          {links && links.length
            ? links.map(({url, label}) => (
                <Link
                  key={url}
                  href={url}
                  variant="underline"
                  sx={{
                    mr: links.length > 1 ? 3 : 0,
                    mb: 3,
                  }}
                >
                  {label}
                </Link>
              ))
            : null}
        </Flex>
      </Box>
    </Box>
  );
}
