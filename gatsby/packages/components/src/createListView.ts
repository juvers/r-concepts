import invariant from 'invariant';
import createStore from 'zustand';
import {produce} from 'immer';

import type {State, UseStore} from 'zustand';

type Lookup = Record<string, unknown>;

type StringKeys<T> = {
  [K in keyof T]: K extends string ? K : never;
}[keyof T];

/**
 * Possible filter names, inferred from the set of items
 * and the associated list view config.
 */
type ListViewFilterName<
  Item extends Lookup,
  Config extends ListViewConfig<Item> = ListViewConfig<Item>
> = Config['filterBy'] extends StringKeys<Item>
  ? Config['filterBy']
  : Config['filterBy'] extends StringKeys<Item>[]
  ? Config['filterBy'][number]
  : keyof Config['filterBy'] extends string
  ? keyof Config['filterBy']
  : string;

type ListViewFilterConfig<Item extends Lookup> =
  | StringKeys<Item>
  | StringKeys<Item>[]
  | Record<string, string>;

/** Configuration for a `ListViewState` store. */
export interface ListViewConfig<Item extends Lookup> {
  /**
   * The initial items to store for the list view.
   *
   * Items may also be provided via the `add` function returned by the hook,
   * for situations where the items aren't known statically.
   */
  items?: Item[];
  /**
   * The possible field names the list may be filtered by.
   *
   * This may be a field name, an array of field names,
   * or an object that maps display names to dot-separated path strings.
   *
   * @example
   * // As a field name:
   * filterBy: 'title',
   * // As an array of field names:
   * filterBy: ['title', 'category'],
   * // As a map of display names to path strings:
   * filterBy: {type: 'category.subCategory'},
   * To have a search bar to search title of given list, here 'name' is required.
   * filterBy: {name: 'title'},
   */
  filterBy?: ListViewFilterConfig<Item>;
  /**
   * The field name to group items by.
   *
   * This may be a field name or dot-separated path string.
   *
   * @example
   * // As a field name:
   * groupBy: 'title',
   * // As a path string:
   * groupBy: 'category.subCategory',
   */
  groupBy?: StringKeys<Item>;
  /**
   * The group scale. Defaults to `'alpha'`.
   *
   * `'alpha'` means groups will be created for the range of sorted
   * first characters of the values of the `groupBy` field.
   *
   * `'numeric'` means groups will be created for the range of sorted
   * number values of the `groupBy` field.
   *
   * `'date'` means groups will be created for the range of dates
   * that covers the values of the `groupBy` field.
   */
  groupScale?: 'alpha' | 'numeric' | 'date';
}

/**
 * A group of items that all have a value for the configured `groupBy`
 * field that falls within the range described by `name`.
 *
 * For the `'alpha'` scale, `name` will be an alphanumeric character
 * matching the first character of the `groupBy` field value
 * on every item in the group.
 *
 * For the `'numeric'` scale, `name` will be a fixed-length, stringified
 * integer matching the `groupBy` field value on every item in the group.
 */
export interface ItemGroup<Item> {
  /** The name of the group. */
  readonly name: string | null;
  /** Whether or not this group has any items. */
  readonly hasItems: boolean;
  /** The list of items in this group. */
  readonly items: ReadonlyArray<Item>;
}

export interface ListViewState<
  Item extends Lookup,
  Config extends ListViewConfig<Item> = ListViewConfig<Item>
> extends State {
  /** The filtered items to display in the view. */
  readonly items: ReadonlyArray<Item>;
  /**
   * An array of tuples, each containing a field name and possible values.
   *
   * This may be used to build a form of `select` style inputs, i.e.
   *
   * @example
   * <form onSubmit={...}>
   *   {options.map(([field, values]) => (
   *     <label key={field}>
   *       {field}
   *       <select onChange={...}>
   *         {values.map((value) => (
   *           <option key={value} name={value} />
   *         ))}
   *       </select>
   *     </label>
   *   ))}
   * </form>
   */
  readonly options: ReadonlyArray<
    [ListViewFilterName<Item, Config>, ReadonlyArray<string>]
  >;
  /**
   * An array of item groups, each containing a group name and an array of
   * items belonging to that group. If no `groupBy` field has been configured,
   * this array will be empty.
   */
  readonly groups: ReadonlyArray<ItemGroup<Item>>;
  /**
   * The currently 'active' group, for list views
   * that implement list group nav behavior.
   *
   * This could be used to update an active state, scroll position, etc.
   */
  /** Save filter values with respect to path */ 
  filterValue: Map<string,string>

  readonly activeGroup: ItemGroup<Item> | null;
  /** Set the active group to one of the list view groups. */
  setActiveGroup: (group: ItemGroup<Item> | null) => void;
  /** Add items to the list view. */
  add: (...items: Item[]) => void;
  /** Apply the named filter for the given value. */
  filter: (filterName: ListViewFilterName<Item, Config>, value: string) => void;
  /** Reset the given filter, or all filters, if no filter name is passed. */
  reset: (filterName?: ListViewFilterName<Item, Config>) => void;
}

const getValue = <Item extends Lookup>(item: Item, path: string) => {
  let value: unknown = item;
  const segments = path.split('.');
  for (let i = 0; i < segments.length; i++) {
    try {
      value = (value as Lookup)[segments[i]];
    } catch (e) {
      throw new Error(
        `Could not pick value by path ${path}: ${JSON.stringify(item)}`,
      );
    }
  }
  return value;
};

/**
 * Reduces `items` to the unique set of string values
 * at the given `fieldPath` on each item.
 */
const getOptionsSet = <Item extends Lookup>(
  items: Iterable<Item>,
  fieldPath: string,
) => {
  const fieldSet = new Set<string>();
  for (const item of items) {
    const value = getValue(item, fieldPath);
    if (value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => fieldSet.add(String(v)));
      } else {
        fieldSet.add(String(value));
      }
    }
  }
  return fieldSet;
};

/**
 * Picks the possible options for the given set of items and filter names,
 * reduced to the possible values allowed by any active filters.
 *
 * Returns an array of tuples that each contain a filter name and a list
 * of possible values for that filter.
 */
const pickOptions = <Item extends Lookup, Config extends ListViewConfig<Item>>(
  items: Iterable<Item>,
  activeFilters: Map<ListViewFilterName<Item, Config>, string>,
  config: Config,
): [ListViewFilterName<Item, Config>, readonly string[]][] => {
  const {filterBy} = config;
  const fields = (Array.isArray(filterBy)
    ? filterBy.map((v) => [v, v])
    : typeof filterBy === 'string'
    ? [[filterBy, filterBy]]
    : typeof filterBy === 'object'
    ? Object.entries(filterBy)
    : []) as [ListViewFilterName<Item, Config>, string][];
  if (!fields.length) return [];

  const filtered = filterItems(items, activeFilters, config);
  const activeFilterEntries = Array.from(activeFilters.entries());
  const opts = {} as Record<string, Set<string>>;
  for (const [fieldName, fieldPath] of fields) {
    // If this field is filtered, we need to generate all options
    // for the field that are allowed by all _other_ active filters.
    // This is because applying a filter for a field should not limit
    // the options available for _that_ field, only for other fields.
    if (activeFilters.has(fieldName)) {
      opts[fieldName] = getOptionsSet(
        filterItems(
          items,
          activeFilterEntries.filter(([name]) => name !== fieldName),
          config,
        ),
        fieldPath,
      );
    } else {
      opts[fieldName] = getOptionsSet(filtered, fieldPath);
    }
  }

  const result = [] as [ListViewFilterName<Item, Config>, string[]][];
  for (const [key, value] of Object.entries(opts)) {
    result.push([key as ListViewFilterName<Item, Config>, Array.from(value)]);
  }
  return result;
};

const matchItemWithFilter = <Item extends Lookup>(
  item: Item,
  path: string,
  match: string,
) => {
  const value = getValue(item, path);
  if (Array.isArray(value)) {
    return value.some((v) => String(v) === match);
  } else {
    if(path == 'title')
      return String(value).toLocaleLowerCase().match(match.toLocaleLowerCase());

    return String(value) === match;
  }
};

const getFilterPath = <
  Item extends Lookup,
  Config extends ListViewConfig<Item>
>(
  name: ListViewFilterName<Item, Config>,
  {filterBy}: Config,
): string | null => {
  if (typeof filterBy === 'string') {
    return filterBy === name ? (name as string) : null;
  } else if (Array.isArray(filterBy)) {
    return filterBy.includes(name as StringKeys<Item>) ? name : null;
  } else {
    return filterBy?.[name as string] ?? null;
  }
};

/** Filter the set of items by the given filter settings. */
const filterItems = <Item extends Lookup, Config extends ListViewConfig<Item>>(
  items: Iterable<Item>,
  activeFilters:
    | Map<ListViewFilterName<Item, Config>, string>
    | [ListViewFilterName<Item, Config>, string][],
  config: Config,
) => {
  const filters = (Array.isArray(activeFilters)
    ? activeFilters
    : Array.from(activeFilters.entries())
  ).map(([filterName, filterValue]) => {
    const pathString = getFilterPath(filterName, config);
    invariant(pathString, `Cannot filter by path ${String(pathString)}`);
    return (item: Item) => matchItemWithFilter(item, pathString, filterValue);
  });
  return Array.from(items).filter((item) =>
    filters.every((filter) => filter(item)),
  );
};

function* groupByAlpha<Item>(
  groups: Map<string, Item[]>,
): Generator<ItemGroup<Item>> {
  for (const name of '#ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    const items = groups.get(name) ?? [];
    yield {name, items, hasItems: Boolean(items.length)};
  }
}

const getAlphaItemKey = (input: unknown): string => {
  const value = String(input).charAt(0);
  if (!isNaN(parseInt(value, 10))) return '#';
  return value.toUpperCase();
};

function* groupByNumeric<Item>(
  groups: Map<number, Item[]>,
): Generator<ItemGroup<Item>> {
  const [min, max] = Array.from(groups.keys()).reduce((minmax, value) => {
    minmax[0] = Math.min(minmax[0] ?? value, value);
    minmax[1] = Math.max(minmax[1] ?? value, value);
    return minmax;
  }, [] as number[]);
  const places = String(max).length;
  for (let i = min; i <= max; i++) {
    const items = groups.get(i) ?? [];
    const name = String(i).padStart(places, '0');
    yield {name, items, hasItems: Boolean(items.length)};
  }
}

const getNumericItemKey = (input: unknown): number => {
  return parseInt(String(input), 10);
};

/**
 * Filter and then group items by the configured `groupBy` field.
 */
const groupItems = <Item extends Lookup, Config extends ListViewConfig<Item>>(
  items: Iterable<Item>,
  filters: Map<ListViewFilterName<Item, Config>, string>,
  config: Config,
) => {
  // First, filter out items.
  const filtered = filterItems(items, filters, config);
  const {groupBy, groupScale = 'alpha'} = config;
  if (groupScale === 'numeric') {
    // Then, group items by numeric `groupBy` value.
    const groups = new Map<number, Item[]>();
    if (groupBy) {
      for (const item of filtered) {
        const groupKey = getNumericItemKey(item[groupBy]);
        const groupItems = groups.get(groupKey) ?? [];
        groupItems.push(item);
        groups.set(groupKey, groupItems);
      }
    }
    return Array.from(groupByNumeric(groups));
  } else {
    // Then, group items by raw `groupBy` value.
    const groups = new Map<string, Item[]>();
    if (groupBy) {
      for (const item of filtered) {
        const groupKey = getAlphaItemKey(item[groupBy]);
        const groupItems = groups.get(groupKey) ?? [];
        groupItems.push(item);
        groups.set(groupKey, groupItems);
      }
    }
    // Finally, generate all _possible_ groups for the given `groupScale`.
    return Array.from(groupByAlpha(groups));
  }
};

/** Add items to the item set. */
const addItems = produce(<Item>(items: Set<Item>, itemsToAdd: Item[]) => {
  itemsToAdd.forEach((item) => items.add(item));
});

/**
 * Update the active filters.
 *
 * If no arguments are provided, all filters are reset.
 * If a `name` is provided, but no value, the named filter is reset.
 *
 * Returns `true` if filters changed.
 */
const updateFilters = produce(
  <Filters extends Map<Name, string>, Name>(
    filters: Filters,
    name?: Name,
    value?: string,
  ) => {
    if (name == null) {
      filters.clear();
    } else if (value == null || value === '') {
      filters.delete(name);
    } else {
      filters.set(name, value);
    }
  },
);

/**
 * Creates a Zustand state hook for managing a filterable list of items.
 *
 * @see https://tishman.netlify.app/hooks/create-list-view
 * @see https://github.com/pmndrs/zustand
 */
export function createListView<
  Config extends ListViewConfig<Item>,
  Item extends Lookup = Config extends ListViewConfig<infer Item>
    ? Item
    : Lookup
>(config: Config): UseStore<ListViewState<Item, Config>> {
  /** The set of all items shown in this list view. */
  let items = new Set(config.items ?? []);
  /** The map of active filters. */
  let filters = new Map<ListViewFilterName<Item, Config>, string>();

  return createStore<ListViewState<Item, Config>>((set) => ({
    items: filterItems(items, filters, config),
    groups: groupItems(items, filters, config),
    options: pickOptions(items, filters, config),
    activeGroup: null,
    setActiveGroup: (group) => void set(() => ({activeGroup: group})),
    add: (...itemsToAdd) => {
      const nextItems = addItems(items, itemsToAdd);
      if (nextItems !== items) {
        items = nextItems;
        set(() => ({
          items: filterItems(items, filters, config),
          groups: groupItems(items, filters, config),
          options: pickOptions(items, filters, config),
        }));
      }
    },
    filter: (name, value) => {
      const nextFilters = updateFilters(filters, name, value);
      if (nextFilters !== filters) {
        filters = nextFilters;
        set(() => ({
          items: filterItems(items, filters, config),
          groups: groupItems(items, filters, config),
          options: pickOptions(items, filters, config),
        }));
      }
    },
    reset: (name) => {
      const nextFilters = updateFilters(filters, name);
      if (nextFilters !== filters) {
        filters = nextFilters;
        set(() => ({
          items: filterItems(items, filters, config),
          groups: groupItems(items, filters, config),
          options: pickOptions(items, filters, config),
        }));
      }
    },
    filterValue: new Map<string,string>()
  }));
}
