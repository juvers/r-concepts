/** @jsx jsx */
import {useRef} from 'react';
import {animated} from 'react-spring';
import {navigate} from 'gatsby';
import {Nav} from '@hzdg/sectioning';
import {
  jsx,
  Grid,
  Button,
  Link,
  SearchSvg,
  usePageTransition,
} from '@tishman/components';
import {SearchInput} from './SearchInput';

function createSearchUri(to: string, q?: string | null): string {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  return `${to}?${params.toString()}`;
}

export interface SearchFormProps {
  /**
   * The path to send search queries to.
   *
   * This path will be appended with a query parameter, i.e.,
   * if `to` is `/search` and the submitted input is `'test'`,
   * the app will navigate to `/search?q='test'`
   */
  to: string;
  /**
   * A list of link data to appear in a secondary nav.
   *
   * @example
   *
   * [
   *   {url: '/top-of-the-rock', label: 'Top of the Rock'},
   *   {url: '/christmas-tree', label: 'Christmas Tree'},
   * ]
   */
  suggestions?: {url: string; label: string}[];
  /**
   * The initial value for the search input.
   */
  initialValue?: string;
}

export function SearchForm({
  to,
  suggestions,
  initialValue,
}: SearchFormProps): JSX.Element {
  const input = useRef<string | undefined>(initialValue);
  const opacityTrail = usePageTransition((suggestions?.length ?? 0) + 2, {
    enter: {opacity: 1, config: {tension: 360, friction: 30}, delay: 300},
    leave: {opacity: 0, config: {tension: 720, friction: 30, clamp: true}},
  });
  return (
    <Grid
      py={[5, null, 7]}
      gap={[3, null, 2]}
      m="0 auto"
      variant="layout.container"
      sx={{
        width: '100%',
        height: '100%',
        minWidth: '320px',
        position: 'relative',
        placeItems: 'start center',
      }}
    >
      <animated.form
        onSubmit={(e) => {
          if (!e.defaultPrevented) {
            e.preventDefault();
            void navigate(createSearchUri(to, input.current));
          }
        }}
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
        }}
        style={opacityTrail[0]}
      >
        <SearchInput
          name="q"
          defaultValue={initialValue}
          onChange={(event) => (input.current = event.target.value)}
        />
        <Button aria-label="search" variant="icon" type="submit">
          <SearchSvg aria-hidden />
        </Button>
      </animated.form>
      {suggestions ? (
        <Nav
          aria-label="suggested search menu"
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: ['column', null, 'row'],
            mt: 3,
          }}
        >
          <animated.span
            aria-hidden
            sx={{
              mr: [0, null, 6],
              mb: [3, null, 0],
              color: 'muted',
              fontSize: [2, null, 3],
            }}
            style={opacityTrail[1]}
          >
            Suggested:
          </animated.span>
          <Grid
            as="ul"
            columns={['1fr', 'repeat(auto-fill, minmax(30%, 1fr))']}
            sx={{flex: 1, columnGap: 4, rowGap: 1}}
          >
            {suggestions.map(({url, label}, index) => (
              <animated.li key={label} style={opacityTrail[index + 2]}>
                <Link
                  variant="menu"
                  sx={{whiteSpace: 'normal', fontSize: [2, 3]}}
                  to={url}
                >
                  {label}
                </Link>
              </animated.li>
            ))}
          </Grid>
        </Nav>
      ) : null}
    </Grid>
  );
}
