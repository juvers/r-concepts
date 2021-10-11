/** @jsx jsx */
import {
  jsx,
  ListGroupNav,
  ListFilterBar,
  FeaturedRetailers,
  createListView,
  Box,
  useScrollTo,
  ItemGroup,
  get,
} from '@tishman/components';
import {
  Fragment,
  useState,
  useRef,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react';

import type {
  Theme,
  ListViewConfig,
  ListViewState,
  ListFilterBarProps,
  UseScrollToConfig,
} from '@tishman/components';
import type {RefObject} from 'react';
type Lookup = Record<string, unknown>;

/**
 * Computes the offset necessary for the list content
 * to comfortably clear the sticky filter bar.
 */
// const calcListOffset = (options: number) => (theme: Theme) => {
//   const size = get(theme, 'sizes.filterMargin');
//   return [`${size * options}px`, `${size}px`];
// };

/**
 * Computes the top offset necessary to position the list group nav
 * below the sticky filter bar.
 */
const calcListGroupNavTop = (theme: Theme) => {
  const {filterBar, filterBarMobile} = get(theme, 'sizes');
  return [`${filterBarMobile}px`, null, `${filterBar}px`];
};

/**
 * Computes the minimum height of the list container that is necessary
 * to fill the viewport, minus sticky elements.
 */
const calcMinListHeight = (hasCta: boolean) => (theme: Theme) => {
  const {filterBarMobile, filterBar, ctaMobile} = get(theme, 'sizes');
  return [
    // Subtract the height of the filter bar (and cta on mobile)
    // from the viewport height to get the height of the group list nav.
    hasCta
      ? `calc(100vh - ${filterBarMobile}px - ${ctaMobile}px)`
      : `calc(100vh - ${filterBarMobile}px)`,
    null,
    `calc(100vh - ${filterBar}px)`,
  ];
};

export interface ListViewRendererProps<Item extends Lookup>
  extends Pick<
    ListViewState<Item>,
    'items' | 'groups' | 'activeGroup' | 'setActiveGroup' | 'filterValue'
  > {
  /**
   * A ref to pass to the active group element.
   * If this ref has a value when the active group has changed,
   * `ListView` will attempt to scroll to the position of the element.
   */
  activeGroupRef: RefObject<HTMLElement>;
}

export interface ListViewRenderer<Item extends Lookup> {
  (props: ListViewRendererProps<Item>): JSX.Element;
}

export interface ListViewProps<
  Item extends Lookup,
  LeftNavState = unknown,
  CtaState = unknown
> extends ListViewConfig<Item>,
    Pick<
      ListFilterBarProps<string, LeftNavState, CtaState>,
      'leftNav' | 'cta'
    > {
  children: ListViewRenderer<Item>;
  domTarget?: UseScrollToConfig['domTarget'];
  featuredRetailers?: Lookup;
}

export function ListView<Item extends Lookup>({
  children: render,
  leftNav,
  cta,
  domTarget,
  featuredRetailers,
  ...listViewConfig
}: ListViewProps<Item>): JSX.Element {
  const [useListData] = useState(() =>
    createListView<ListViewConfig<Item>>(listViewConfig),
  );

  const [filterValue, setFilterValue] =  useState<Map<string,string>>(new Map());

  // FIXME: Gotta update the items, options, filter, etc when the config changes.
  const {
    options,
    filter,
    items,
    groups,
    activeGroup,
    setActiveGroup,
  } = useListData();

  /** Whether or not scroll position is animating. */
  const animating = useRef(false);
  const scrollTo = useScrollTo({
    domTarget,
    forceAnimation: true,
    onStart: () => void (animating.current = true),
    onRest: () => void (animating.current = false),
  });

  const activeGroupRef = useRef<HTMLElement>(null);
  const renderProps = useMemo(
    () => ({
      items,
      groups,
      activeGroup,
      filterValue,
      setActiveGroup: (group: ItemGroup<Item> | null) => {
        if (group !== activeGroup && !animating.current) {
          setActiveGroup(group);
        }
      },
      activeGroupRef,
    }),
    [activeGroup, groups, items, setActiveGroup, filterValue],
  );

  // Scroll to the top of the list whenever the filters change.
  const listRef = useRef<HTMLDivElement>(null);
  const handleFilterChange = useCallback(
    (...[key, value]: Parameters<typeof filter>) => {
      updateFilterValue(key, value);
      filter(key, value);
      scrollTo(listRef);
    },
    [filter, scrollTo],
  );

  const invalid = useRef(false);

  const updateFilterValue = (k: string, v: string) => {
    setFilterValue(filterValue.set(k, v));
  };

  const handleActiveGroupChange = useCallback(
    (group: ItemGroup<Item> | null) => {
      invalid.current = true;
      setActiveGroup(group);
    },
    [setActiveGroup],
  );

  useLayoutEffect(() => {
    if (invalid.current && activeGroupRef.current) {
      scrollTo(activeGroupRef.current);
    }
    invalid.current = false;
  }, [activeGroup, scrollTo]);

  return (
    <Fragment>
      <ListFilterBar
        options={options}
        onFilterChange={handleFilterChange}
        leftNav={leftNav}
        cta={cta}
        filterValue={filterValue}
      />
      {featuredRetailers && featuredRetailers.retailers && (
        <FeaturedRetailers {...featuredRetailers} />
      )}
      <Box
        sx={{
          // Offset the top margin by enough to clear the sticky filter bar.
          display: 'grid',
          gridTemplateColumns: '1fr min-content',
          gridTemplateAreas: `". nav"`,
        }}
      >
        <Box ref={listRef} sx={{minHeight: calcMinListHeight(Boolean(cta))}}>
          {render(renderProps)}
        </Box>
        <ListGroupNav
          groups={renderProps.groups}
          activeGroup={renderProps.activeGroup}
          onActiveGroupChange={handleActiveGroupChange}
          sx={{
            position: 'sticky',
            top: calcListGroupNavTop,
            height: calcMinListHeight(Boolean(cta)),
          }}
        />
      </Box>
    </Fragment>
  );
}
