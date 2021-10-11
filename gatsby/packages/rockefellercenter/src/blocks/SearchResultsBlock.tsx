/** @jsx jsx */
import {
  jsx,
  Box,
  Section,
  Text,
  Styled,
  Spinner,
  Container,
  createStore,
  Link,
} from '@tishman/components';
import {ErrorBoundary} from 'react-error-boundary';
import {memo, Suspense, useState, useMemo, useEffect} from 'react';
import {useLocation} from '@reach/router';
import {parse} from 'query-string';
import {GOOGLE_API_KEY, GOOGLE_SEARCH_KEY} from '~environment';

import type {FallbackProps} from 'react-error-boundary';
import type {State, StateCreator} from '@tishman/components';

interface SearchResult {
  readonly title: string;
  readonly link: string;
  readonly formattedUrl: string;
  readonly htmlSnippet: string;
}

interface RawSearchResult {
  readonly items?: SearchResult[] | null;
}

interface SearchQueryState extends State {
  /** The status of the current search. */
  readonly status: 'init' | 'loading' | 'loaded' | 'errored';
  /** The payload associated with the current `status`. */
  readonly payload: null | Promise<unknown> | SearchResult[] | Error;
  /** The query being used to generate search results. */
  readonly query: string | null | undefined;
  /** Run a search using a new query. */
  run: (query?: string | null, signal?: AbortSignal) => void;
}

interface Init extends SearchQueryState {
  /** - `'init'`: A query has not been run yet. */
  readonly status: 'init';
  /** - `'init'`: Payload is `null`. */
  readonly payload: null;
}

interface Loading extends SearchQueryState {
  /** - `'loading'`: Query results have not resolved yet.  */
  readonly status: 'loading';
  /** - `'loading'`: Payload is a `Promise`.  */
  readonly payload: Promise<unknown>;
}

interface Loaded extends SearchQueryState {
  /** - `'loaded'`: Query results have resolved.  */
  readonly status: 'loaded';
  /** - `'loaded'`: Payload is an array of `SearchResult` values.  */
  readonly payload: SearchResult[];
}

interface Errored extends SearchQueryState {
  /** - `'errored'`: Query failed to resolve.  */
  readonly status: 'errored';
  /** - `'errored'`: Payload is an `Error`.  */
  readonly payload: Error;
}

/**
 * The current search status, its associated query string,
 * and a `run` method to start a new search.
 */
type SearchState = Init | Loading | Loaded | Errored;

/**
 * Fetch search results from the search API.
 *
 * This works just like `fetch`, except it will resolve
 * to the unwrapped data instead of the `Response`.
 */
async function fetchSearchResults(query: string, opts?: RequestInit) {
  const response = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_KEY}&q=${query}&num=5&start=1`,
    opts,
  );
  return response.json();
}

/** Creates a new `SearchState`. */
const createSearchState = (
  /** The `set` function for the associated store, provided by `createStore`. */
  set: Parameters<StateCreator<SearchState>>[0],
  /** The `get` function for the associated store, provided by `createStore`. */
  get: Parameters<StateCreator<SearchState>>[1],
): SearchState => ({
  status: 'init',
  payload: null,
  query: null,
  run: (newQuery, signal) => {
    const {status, query} = get();
    if (query === newQuery) return;
    if (newQuery == null) {
      switch (status) {
        case 'loading':
        case 'loaded': {
          set((state) => {
            state.status = 'init';
            state.payload = null;
          });
        }
      }
    } else {
      set((state) => {
        try {
          const promise = fetchSearchResults(newQuery, {signal});
          void (async () => {
            try {
              const result = (await promise) as RawSearchResult;
              if (get().payload === promise) {
                const dataResults = result?.items ?? null;
                set((state) => {
                  state.status = 'loaded';
                  state.payload = dataResults;
                });
              }
            } catch (e) {
              if (
                get().payload === promise &&
                (e as Error).name !== 'AbortError'
              ) {
                set((state) => {
                  state.status = 'errored';
                  state.payload = new Error(e);
                });
              }
            }
          })();
          state.status = 'loading';
          state.payload = promise;
        } catch (e) {
          state.status = 'errored';
          state.payload = new Error(e);
        }
      });
    }
  },
});

/**
 * Use the search results for the given query string.
 *
 * Note: This hook _throws_ a `Promise` while it is loading results,
 * and it also may throw errors, so be sure to wrap any component
 * that uses it in both a `Suspense` and an `ErrorBoundary`.
 *
 * @see https://reactjs.org/docs/react-api.html#reactsuspense
 * @see https://github.com/bvaughn/react-error-boundary
 */
const useSearchResults = (query?: string | null) => {
  // Create a new `useStore<SearchState>` hook.
  // We use `useState` like this (instead of `useMemo`)
  // to take advantage of its initializing callback,
  // which is guaranteed to only be called once.
  const [useStore] = useState(() =>
    createStore<SearchState>(createSearchState),
  );
  const {run, ...state} = useStore();

  // Whenever the `query` prop changes,
  // fetch new results as a side effect.
  useEffect(() => {
    // Make our fetch cancellable.
    const controller = new AbortController();
    run(query, controller.signal);
    // When this effect is cleaned up (by a new `query` or on unmount)
    // we send the abort signal to the fetch.
    return () => controller.abort();
  }, [query, run]);

  // Results are loading, so throw the `Promise` payload.
  // This how the hook suspends rendering of the results.
  if (state.status === 'loading') throw state.payload;
  // An error occurred, so throw the error payload.
  if (state.status === 'errored') throw state.payload;
  // Either we have search results or no search input.
  return state.payload;
};

function SearchResultsList() {
  // Parse the search string from the current location
  // (the bit after '?q=' in the URL).
  const location = useLocation();
  const query = useMemo(
    () => parse(location.search).q?.toString() ?? undefined,
    [location],
  );
  // Fetch search results for this query, if necessary.
  const results = useSearchResults(query);
  if (!results && !query) {
    return (
      <Box>
        <Text>Please enter a search term</Text>
      </Box>
    );
  }
  if (!results) {
    return (
      <Box>
        <Text>Please Try Another Search Query</Text>
      </Box>
    );
  }

  return (
    <Styled.ol sx={{maxWidth: ['100%', 800]}}>
      {results.map((result, index) => (
        <Styled.li key={index}>
          <Link
            to={result.link}
            sx={{
              variant: 'links.eventTitle',
              textDecoration: 'none',
              mb: 2,
              fontSize: [3, 5],
              display: 'block',
            }}
          >
            {result.title}
          </Link>
          <Link
            to={result.link}
            variant="searchResultLink"
            sx={{display: ['none', 'none', 'inline-block']}}
          >
            {result.formattedUrl}
          </Link>
          <Text
            sx={{variant: 'text.search', mt: 2, mb: 6, display: 'block'}}
            dangerouslySetInnerHTML={{__html: result.htmlSnippet}}
          />
        </Styled.li>
      ))}
    </Styled.ol>
  );
}

/** TODO: Implement a pretty `ErrorMessage`. */
function ErrorMessage({error}: FallbackProps) {
  return (
    <Box>
      <Text>Something went wrong:</Text>
      <Styled.pre sx={{width: '100%'}}>{error?.message}</Styled.pre>
    </Box>
  );
}

// It's not exactly bulletproof, but it'll let us use `Suspense`
// without breaking SSR.
const isBrowser = typeof window !== 'undefined';

export const SearchResultsBlock = memo(function SearchResultsBlock() {
  return (
    <Section>
      <Container>
        {isBrowser ? (
          <ErrorBoundary FallbackComponent={ErrorMessage}>
            <Suspense fallback={<Spinner />}>
              <SearchResultsList />
            </Suspense>
          </ErrorBoundary>
        ) : null}
      </Container>
    </Section>
  );
});
