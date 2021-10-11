/** @jsx jsx */
import {useStaticQuery, graphql} from 'gatsby';
import invariant from 'invariant';

import type {MenuLink} from './useMenuLinkGroups';

const SEARCH_SUGGESTION_LINKS_QUERY = graphql`
  query SearchSuggestionLinks {
    dataJson(id: {eq: "search-menu"}) {
      searchSuggestionLinks {
        label
        url
      }
    }
  }
`;

export const useSearchSuggestionLinks = (): MenuLink[] => {
  const {dataJson} = useStaticQuery<GatsbyTypes.SearchSuggestionLinksQuery>(
    SEARCH_SUGGESTION_LINKS_QUERY,
  );
  invariant(dataJson, 'search menu JSON data is required!');
  return dataJson.searchSuggestionLinks as MenuLink[];
};
