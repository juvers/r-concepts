/** @jsx jsx */
import {jsx, ThemeProvider, getThemeByName} from '@tishman/components';
import {memo, useState} from 'react';
import {useLocation} from '@reach/router';
import {parse} from 'query-string';
import {SearchForm} from '~components/SearchForm';
import {useSearchSuggestionLinks} from '~blocks/queries';

export const SearchFormBlock = memo(function SearchFormBlock() {
  const searchSuggestionLinks = useSearchSuggestionLinks();
  const location = useLocation();
  const [initialValue] = useState(
    () => parse(location.search).q?.toString() ?? undefined,
  );
  return (
    <ThemeProvider theme={getThemeByName('Rock Center Black')}>
      <SearchForm
        to="/search"
        suggestions={searchSuggestionLinks}
        initialValue={initialValue}
      />
    </ThemeProvider>
  );
});
