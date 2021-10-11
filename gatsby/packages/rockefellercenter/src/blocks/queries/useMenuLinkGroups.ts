/** @jsx jsx */
import {useStaticQuery, graphql} from 'gatsby';
import invariant from 'invariant';

const MENU_LINKS_QUERY = graphql`
  query MenuLinks {
    dataJson(id: {eq: "menu"}) {
      menuLinkGroups {
        label
        links {
          label
          url
        }
        url
      }
      menuSecondaryLinks {
        label
        url
      }
    }
  }
`;

export interface MenuLink {
  label: string;
  url: string;
}

export interface MenuLinkGroup {
  label: string;
  url: string;
  links: MenuLink[];
}

export const useMenuLinkGroups = (): {
  menuLinkGroups: MenuLinkGroup[];
  menuSecondaryLinks: MenuLink[];
} => {
  const {dataJson} = useStaticQuery<GatsbyTypes.MenuLinksQuery>(
    MENU_LINKS_QUERY,
  );
  invariant(dataJson, 'menu JSON data is required!');
  return dataJson as {
    menuLinkGroups: MenuLinkGroup[];
    menuSecondaryLinks: MenuLink[];
  };
};
