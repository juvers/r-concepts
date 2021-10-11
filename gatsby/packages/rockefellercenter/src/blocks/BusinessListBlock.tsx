/** @jsx jsx */
import {
  jsx,
  Container,
  IntersectionSection,
  Grid,
  Box,
  Section,
  ListView,
  ThemeProvider,
  getThemeByName,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import BusinessListItem from '~components/BusinessListItem';

import type {TishmanThemeName, ListViewProps} from '@tishman/components';
import type {BusinessListItemProps} from '~components/BusinessListItem';

type BusinessListItem = Record<string, unknown> & BusinessListItemProps;

export interface BusinessListBlockProps<Item extends BusinessListItem>
  extends Omit<ListViewProps<Item>, 'children' | 'ref'> {
  theme?: TishmanThemeName;
}

export function BusinessListBlock<Item extends BusinessListItem>({
  theme = 'Rock Center',
  ...listViewProps
}: BusinessListBlockProps<Item>): JSX.Element {
  return (
    <Box>
      <ListView {...listViewProps}>
        {({
          groups,
          filterValue,
          activeGroup,
          setActiveGroup,
          activeGroupRef,
        }) => (
          <ThemeProvider theme={getThemeByName(theme)}>
            <Box bg="background" sx={{minHeight: '100%'}}>
              <Container>
                {groups?.filter((item) => item.hasItems == true).length ==
                  0 && (
                  <IntersectionSection py={[8, 8]}>
                    <Section
                      sx={{
                        py: [3, 4],
                        px: [2, null, null, 6],
                        position: 'relative',
                        fontWeight: 'medium',
                        textAlign: 'start',
                        fontSize: [4, null, 5, 6],
                        lineHeight: 1,
                        maxWidth: 990,
                      }}
                    >
                      <H
                        sx={{
                          variant: 'text.heading',
                          fontFamily: 'headingSecondary',
                          fontSize: [6, 7],
                          letterSpacing: 0,
                          my: [2, null, null, 0],
                          mr: [0, null, null, 6],
                          wordBreak: 'break-word',
                        }}
                      >
                        {`No results for '${filterValue.get('name')}'`}
                      </H>
                    </Section>
                  </IntersectionSection>
                )}
                {groups.map((group) =>
                  group.name && group.hasItems ? (
                    <IntersectionSection
                      ref={group === activeGroup ? activeGroupRef : null}
                      key={group.name}
                      onIntersection={() => setActiveGroup(group)}
                      pt={[3, 40]}
                    >
                      <Grid gap={0} columns={['1fr', null, '1fr auto']} pr={6}>
                        <Box ml={[0, null, null, null, null, -7]}>
                          <H sx={{variant: 'styles.h1', fontFamily: 'heading'}}>
                            {group.name}
                          </H>
                        </Box>
                        <ol>
                          {group.items.map((business, index) => (
                            <li key={index}>
                              <BusinessListItem {...business} />
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
