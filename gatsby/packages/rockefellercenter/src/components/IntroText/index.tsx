/** @jsx jsx */
import {
  jsx,
  Flex,
  Box,
  Text,
  Link,
  SxStyleProp,
  SanityRichText,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import type {Block} from '@sanity/block-content-to-react';

interface IntroTextProps {
  title?: string;
  /** Body text for the intro text block. */
  caption?: string;
  /** Body rich text for the intro text block. */
  captionRichText?: Block;
  /** Sets flex direction of div.
   * Column = Vertical orientation. Header above tex, textt above link.
   * Row = Horizontal oreintation. Header left of text, text left of link.
   * Default is 'column'
   */
  desktopOrientation?: 'row' | 'column';
  /** Sets whether header, text, and link are center aligned. */
  center?: boolean;
  /** Sets max width of component. */
  maxWidth?: number;
  /** Any overriding styles to change default styling */
  sx?: SxStyleProp;
  /** Some sx props get passed as classNames to components */
  className?: string;
  /** Title/Heading for the intro text block. */
  /** Object with the link URL and link title.
   * Requires both to display the button.
   * Leave out to hide button.
   */
  links?: {
    url: string;
    label: string;
  }[];
}
const IntroText = ({
  title,
  caption,
  captionRichText,
  desktopOrientation = 'column',
  center = false,
  maxWidth = 730,
  sx,
  className,
  links,
}: IntroTextProps): JSX.Element => {
  return (
    <Box
      className={className}
      sx={{
        maxWidth: desktopOrientation === 'column' ? maxWidth : 'none',
        ...sx,
      }}
    >
      <Flex
        sx={{
          flexDirection: ['column', desktopOrientation],
          justifyContent: 'space-evenly',
          ...(center && desktopOrientation !== 'row' && {textAlign: 'center'}),
        }}
      >
        {title && (
          <H
            sx={{
              variant: 'text.introTextHeading',
              mb: 3,
              px: 1,
              fontSize: [6, 7],
              ...(desktopOrientation !== 'column' && {flexBasis: '50%'}),
            }}
          >
            {title}
          </H>
        )}
        <Box
          sx={{
            px: 1,
            ...(desktopOrientation !== 'column' && {flexBasis: '50%'}),
          }}
        >
          {caption && (
            <Text
              as="p"
              sx={{
                fontSize: [2, 3],
                letterSpacing: [2, 1],
                opacity: 0.8,
                ...(links && {mb: 4}),
              }}
            >
              {caption}
            </Text>
          )}
          {captionRichText && <SanityRichText blocks={captionRichText} />}
          {links && (
            <Box
              sx={{
                display: ['none', null, 'flex'],
                flexDirection: 'row',
                ...(center && {justifyContent: 'center'}),
              }}
            >
              {links.map((link) => {
                return (
                  link.url &&
                  link.label && (
                    <Link
                      key={link.label}
                      variant="button"
                      href={link.url}
                      sx={{mr: 3}}
                    >
                      {link.label}
                    </Link>
                  )
                );
              })}
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
};
export default IntroText;
