/** @jsx jsx */
import {
  jsx,
  Container,
  Box,
  ListView,
  ThemeProvider,
  getThemeByName,
  IntersectionSection,
  Grid,
} from '@tishman/components';
import ArtListItem from '~components/ArtListItem';
import {H} from '@hzdg/sectioning';

import type {TishmanThemeName, ListViewProps} from '@tishman/components';
import type {ArtListItemProps} from '~components/ArtListItem';

type ArtListItem = Record<string, unknown> & ArtListItemProps;
export interface ArtListBlockProps<Item extends ArtListItem>
  extends Omit<ListViewProps<Item>, 'children' | 'ref'> {
  theme?: TishmanThemeName;
}

export function ArtListBlock<Item extends ArtListItem>({
  theme = 'Rock Center',
  ...listViewProps
}: ArtListBlockProps<Item>): JSX.Element {
  return (
    <Box>
      <ListView {...listViewProps}>
        {({groups, activeGroup, setActiveGroup, activeGroupRef}) => (
          <ThemeProvider theme={getThemeByName(theme)}>
            <Box bg="background" sx={{minHeight: '100%'}}>
              <Container>
                {groups.map((group) =>
                  group.name && group.hasItems ? (
                    <IntersectionSection
                      ref={group === activeGroup ? activeGroupRef : null}
                      key={group.name}
                      onIntersection={() => setActiveGroup(group)}
                      py={[3, 6]}
                    >
                      <Grid gap={0} columns={['1fr', null, '1fr auto']} pr={6}>
                        <Box ml={[0, null, null, null, null, -7]}>
                          <H sx={{variant: 'styles.h1', fontFamily: 'heading'}}>
                            {group.name}
                          </H>
                        </Box>
                        <ol>
                          {group.items.map((art, index) => (
                            <li key={index}>
                              <ArtListItem {...art} />
                            </li>
                          ))}
                        </ol>
                      </Grid>
                    </IntersectionSection>
                  ) : null,
                )}
              </Container>
            </Box>
          </ThemeProvider>
        )}
      </ListView>
    </Box>
  );
}
