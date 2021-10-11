/** @jsx jsx */
import {
  jsx,
  Grid,
  Box,
  Text,
  Flex,
  Link,
  SxStyleProp,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {Ref, forwardRef, ReactNode} from 'react';
import useSize from '@hzdg/use-size';

interface CalloutGridProp {
  /**
   * The Grid offset when there are two columns
   * (how many pixels down should right column be)
   * */
  offset?: number;
  /** Any overriding styles to change default styling */
  sx?: SxStyleProp;
  /** Some sx props get passed as classNames to components */
  className?: string;
  /**
   * Some Callout Grids have an optional title or caption.
   *
   * If a title or title and caption are provided, the
   * offset will no longer use the `offset` variable above, but instead
   * will calculate the height of the TitleBlock to align the grid
   * to match designs
   * */
  title?: string;
  /** caption used in TitleBlock
   * to render the TitleBlock
   */
  caption?: string;
  /** links used in TitleBlock
   * to render the TitleBlock
   */
  links?: readonly Pick<CalloutGridLink, 'label' | 'url'>[];
  /** Grid cards being passed into the grid */
  children: ReactNode;
  /** reduces the grid margin by the calculated height of the title block */
  hideOffset?: boolean;
}

interface CalloutGridLink {
  url: string;
  label: string;
}

const TitleBlock = forwardRef(function TitleBlock(
  {
    title,
    caption,
    links,
  }: {
    title?: string;
    caption?: string;
    links?: readonly {
      url: string;
      label: string;
    }[];
  },
  ref: Ref<HTMLDivElement>,
) {
  return (
    <Box
      ref={ref}
      sx={{gridColumn: [1, null, 2], ml: [0, 4], direction: 'ltr'}}
    >
      <Box sx={{mb: [5, 5, 82]}}>
        {title && (
          <H
            sx={{
              variant: 'text.heroTitleSmall',
              fontFamily: 'headingSecondary',
              mb: 3,
            }}
          >
            {title}
          </H>
        )}
        {caption && <Text sx={{variant: 'text.mediumP'}}>{caption}</Text>}
        {links && links.length > 0 && (
          <Flex mt={3}>
            {links.map(({url, label}) => (
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
        )}
      </Box>
    </Box>
  );
});

export const CalloutGrid = ({
  offset = 220,
  sx,
  className,
  children,
  hideOffset,
  title,
  caption,
  links = [],
}: CalloutGridProp): JSX.Element => {
  const [{height: titleBlockHeight}, titleBlockRef] = useSize();
  const showTitleBlock = title !== undefined;
  return (
    <Grid
      columns={[1, null, 2]}
      gap={0}
      className={className}
      sx={{
        '> div:nth-of-type(even)': {
          mb: [
            48,
            null,
            showTitleBlock ? (hideOffset ? -titleBlockHeight : 0) : offset,
          ],
          justifySelf: 'flex-end',
          transform: [
            'translateY(0)',
            null,
            showTitleBlock
              ? `translateY(-${titleBlockHeight}px)`
              : `translateY(${offset}px)`,
          ],
        },
        ...sx,
      }}
    >
      {title && (
        <TitleBlock
          ref={titleBlockRef}
          title={title}
          caption={caption}
          links={links}
        />
      )}
      {children}
    </Grid>
  );
};
