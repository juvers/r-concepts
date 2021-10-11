import {
  useState,
  useMemo,
  useLayoutEffect,
  useEffect,
  useCallback,
} from 'react';
import invariant from 'invariant';
import {
  getContainingElement,
  getNearestScrollNode,
  getDocument,
  findAncestor,
} from '@hzdg/dom-utils';
import {createStore} from '@tishman/components';
import useSize from '@hzdg/use-size';

import type {ResponsiveStyleValue, State, Draft} from '@tishman/components';
import type {Size} from '@hzdg/use-size';

const getNearestPositionedAncestor = (node: HTMLElement | null) => {
  if (!node) return null;
  const result = findAncestor(
    node?.parentElement,
    (parent) => getComputedStyle(parent).position !== 'static',
  );
  return result ?? getDocument(node)?.documentElement ?? null;
};

/**
 * Add all of the offsets between the root and the element together.
 *
 * This sum is how much the position must be adjusted to account for
 * any margin, padding, or positioning in between the root and the element.
 */
const getOffsetFromRoot = (
  offset: 'top' | 'right' | 'bottom' | 'left',
  element?: HTMLElement | null,
  root?: HTMLElement | null,
): number => {
  if (!element) return 0;
  if (!root) return 0;
  if (!root.contains(element)) return 0;
  switch (offset) {
    case 'top': {
      let result = element.offsetTop - root.offsetTop;
      let parent = element.parentElement;
      while (parent && root.contains(parent)) {
        result += parent.offsetTop;
        parent = parent.parentElement as HTMLElement;
      }
      return result;
    }
    case 'right': {
      let result = 0;
      let parent = element.parentElement;
      while (parent && root.contains(parent)) {
        result +=
          parent.offsetLeft +
          parent.offsetWidth -
          (element.offsetLeft + element.offsetWidth);
        element = parent;
        parent = parent.parentElement as HTMLElement;
      }
      return result;
    }
    case 'bottom': {
      let result = 0;
      let parent = element.parentElement;
      while (parent && root.contains(parent)) {
        result +=
          parent.offsetTop +
          parent.offsetHeight -
          (element.offsetTop + element.offsetHeight);
        element = parent;
        parent = parent.parentElement as HTMLElement;
      }
      return result;
    }
    case 'left': {
      let result = element.offsetLeft - root.offsetLeft;
      let parent = element.parentElement;
      while (parent && root.contains(parent)) {
        result += parent.offsetLeft;
        parent = parent.parentElement as HTMLElement;
      }
      return result;
    }
  }
};

export type PositionType =
  | 'static'
  | 'relative'
  | 'absolute'
  | 'fixed'
  | 'sticky';

export interface Position {
  /**
   * How the element's position is computed. May be:
   *   - `'static'`: The element is in the flow of its container,
   *   - `'relative'`: The element is in the flow of its container,
   *     and _may be_ positioned relative to itself.
   *   - `'absolute'`: The element is removed from the flow
   *     and positioned relative to a positioned ancestor.
   *   - `'fixed'`: The element is removed from the flow
   *     and positioned relative to the viewport or containing block.
   *   - `'sticky'`: The element is in the flow of its container,
   *     unless it is outside of the offset to its nearest scrolling ancestor
   *     and containing block, in which case it is removed from the flow
   *     and positioned relative to the scrolling ancestor or containing block.
   */
  position?: PositionType;
  /**
   * The top position. Value can be a number, pixel value, percentage,
   * or `auto`. It may also be a responsive array of any of the same types.
   * If this value is `auto`, then when the element is fixed, its
   * top position will be calculated to offset the element from
   * other elements auto fixed to the top of the same root.
   */
  top?: ResponsiveStyleValue<string | number>;
  /**
   * The right position. Value can be a number, pixel value, percentage,
   * or `auto`. It may also be a responsive array of any of the same types.
   * If this value is `auto`, then when the element is fixed, its
   * right position will be calculated to offset the element from
   * other elements auto fixed to the right of the same root.
   */
  right?: ResponsiveStyleValue<string | number>;
  /**
   * The bottom position. Value can be a number, pixel value, percentage,
   * or `auto`. It may also be a responsive array of any of the same types.
   * If this value is `auto`, then when the element is fixed, its
   * bottom position will be calculated to offset the element from
   * other elements auto fixed to the bottom of the same root.
   */
  bottom?: ResponsiveStyleValue<string | number>;
  /**
   * The left position. Value can be a number, pixel value, percentage,
   * or `auto`. It may also be a responsive array of any of the same types.
   * If this value is `auto`, then when the element is fixed, its
   * left position will be calculated to offset the element from
   * other elements auto fixed to the left of the same root.
   */
  left?: ResponsiveStyleValue<string | number>;
}

type BorderBoxSize = {
  blockSize: number;
  inlineSize: number;
};

type Offsets = {top: number; right: number; bottom: number; left: number};
const createOffsets = (initial: Partial<Offsets> = {}) => ({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  ...initial,
});

/** A node in a tree of sticky containers. */
interface ContainerNode {
  parent: ContainerNode | null;
  container: HTMLElement;
  offsets: Offsets;
}

/**
 * `PositionState` tracks the last computed position and size
 * of an element, and also exposes actions for setting
 * the position and size of the element.
 */
export interface PositionState extends Readonly<Position> {
  /** The last computed size of this element. */
  readonly size: Readonly<BorderBoxSize>;
  /**
   * The element's top position should be computed to account for
   * other elements fixed or sticky to the same root.
   */
  readonly autoTop: boolean;
  /**
   * The element's right position should be computed to account for
   * other elements fixed or sticky to the same root.
   */
  readonly autoRight: boolean;
  /**
   * The element's bottom position should be computed to account for
   * other elements fixed or sticky to the same root.
   */
  readonly autoBottom: boolean;
  /**
   * The element's left position should be computed to account for
   * other elements fixed or sticky to the same root.
   */
  readonly autoLeft: boolean;
  /**
   * An action that can be used like an immer producer
   * to update the `Position` state for the element.
   */
  setPosition?: (produce: (draft: Draft<Position>) => void) => void;
  /**
   * An action that can be used like an immer producer
   * to update the `BorderBoxSize` state for the element.
   */
  setSize?: (produce: (draft: Draft<BorderBoxSize>) => void) => void;
}

/**
 * The global `PositionStore` tracks positions
 * by element across the entire application.
 */
interface PositionStore extends State {
  /** A map of elements to their position states. */
  readonly positionsByElement: ReadonlyMap<HTMLElement, PositionState>;
  /**
   * An action that registers the element with the `PositionStore`.
   *
   * When the action is invoked, it returns a 'cleanup' action
   * that does the opposite of `init`.
   */
  add: (
    element: HTMLElement,
    root: HTMLElement,
    initialState: PositionState,
  ) => () => void;
}

/** A map of root elements to ordered sets of elements. */
const elementsByRoot = new WeakMap<HTMLElement, Set<HTMLElement>>();
/** A map of elements to their root elements. */
const rootsByElement = new WeakMap<HTMLElement, HTMLElement>();

/**
 * Updates all positions in the element set.
 *
 * The assumption here is that the `elementSet` is the set of elements
 * that are positioned relative to the same root, and that they are in
 * DOM order. Each successive element's `'auto'` position property
 * will be computed to be offset by all previous elements' `'auto'`
 * positions and size in the same dimension.
 */
const updatePositions = (
  positionsByElement: Map<Draft<HTMLElement>, Draft<PositionState>>,
  elementSet: Iterable<HTMLElement>,
  root: HTMLElement,
) => {
  /** The computed position properties of the next auto fixed element. */
  const fixedOffsets = createOffsets();
  /** A map of elements to their computed offsets. */
  const offsetMap = new Map() as Map<HTMLElement, Offsets>;
  offsetMap.set(root, fixedOffsets);

  /** Whether or not there are any elements auto fixed for each property. */
  const hasFixed = {top: false, right: false, bottom: false, left: false};

  /** The list of sticky element states that need to be computed. */
  const stickyStates: {
    element: HTMLElement;
    state: Draft<PositionState>;
  }[] = [];

  for (const element of elementSet) {
    const state = positionsByElement.get(element as Draft<HTMLElement>);
    if (
      !state?.autoTop &&
      !state?.autoRight &&
      !state?.autoBottom &&
      !state?.autoLeft
    ) {
      // Don't compute this element if none of the properties are auto.
      continue;
    }

    // Compute the offset for a fixed element now,
    // but queue up a sticky element to be computed once
    // we know the state of all fixed elements.
    if (state?.position === 'fixed') {
      if (state.autoTop) {
        hasFixed.top = true;
        state.top = fixedOffsets.top;
        fixedOffsets.top += state.size.blockSize;
      }
      if (state.autoRight) {
        hasFixed.right = true;
        state.right = fixedOffsets.right;
        fixedOffsets.right += state.size.inlineSize;
      }
      if (state.autoBottom) {
        hasFixed.bottom = true;
        state.bottom = fixedOffsets.bottom;
        fixedOffsets.bottom += state.size.blockSize;
      }
      if (state.autoLeft) {
        hasFixed.left = true;
        state.left = fixedOffsets.left;
        fixedOffsets.left += state.size.inlineSize;
      }
    } else if (state?.position === 'sticky') {
      stickyStates.push({element, state});
    }
  }

  /** The root node of the container tree. */
  const rootNode: ContainerNode = {
    container: root,
    offsets: createOffsets(fixedOffsets),
    parent: null,
  };

  /** A map of container elements to their nodes in the container tree. */
  const containerNodes = new Map<HTMLElement, ContainerNode>([
    [root, rootNode],
  ]);

  /**
   * A map of offsets to properties that must be computed in reverse. */
  const reverseMap = new Map<
    Offsets,
    {
      right?: [Draft<PositionState>, number][];
      bottom?: [Draft<PositionState>, number][];
    }
  >();

  stickyStates.forEach(({state, element}) => {
    const scrollNode = getNearestScrollNode(element);
    const container = getContainingElement(element);
    if (!scrollNode || !container) return;

    let node = containerNodes.get(container);
    // If we don't already have a node for this container, we must create one.
    if (!node) {
      // Find a parent container node, or use the rootNode if none is found.
      let parentContainer = getContainingElement(container);
      let parentNode = containerNodes.get(parentContainer as HTMLElement);
      while (parentContainer && !parentNode) {
        parentContainer = getContainingElement(parentContainer);
        parentNode = containerNodes.get(parentContainer as HTMLElement);
      }
      if (!parentNode) parentNode = rootNode;
      // Create a new node for this container.
      node = {
        container,
        offsets: createOffsets(parentNode.offsets),
        parent: parentNode,
      };
    }
    containerNodes.set(container, node);

    if (state.autoTop) {
      const offset = hasFixed.top
        ? getOffsetFromRoot('top', scrollNode, root)
        : getOffsetFromRoot('top', scrollNode, container);
      state.top = node.offsets.top - offset;
      node.offsets.top += state.size.blockSize;
    }

    if (state.autoLeft) {
      const offset = hasFixed.left
        ? getOffsetFromRoot('left', scrollNode, root)
        : getOffsetFromRoot('left', scrollNode, container);
      state.left = node.offsets.left - offset;
      node.offsets.left += state.size.inlineSize;
    }

    // We queue up computation of bottom positions because
    // they should stack in bottom-to-top order instead of top-to-bottom.
    if (state.autoBottom) {
      const offset = hasFixed.bottom
        ? getOffsetFromRoot('bottom', scrollNode, root)
        : getOffsetFromRoot('bottom', scrollNode, container);
      const queued = reverseMap.get(node.offsets) ?? {};
      reverseMap.set(node.offsets, queued);
      (queued.bottom ?? (queued.bottom = [])).push([state, offset]);
    }

    // We queue up computation of right positions because
    // they should stack in right-to-left order instead of left-to-right.
    if (state.autoRight) {
      const offset = hasFixed.right
        ? getOffsetFromRoot('right', scrollNode, root)
        : getOffsetFromRoot('right', scrollNode, container);
      const queued = reverseMap.get(node.offsets) ?? {};
      reverseMap.set(node.offsets, queued);
      (queued.right ?? (queued.right = [])).push([state, offset]);
    }
  });

  // Finally, we compute bottom and right auto positions,
  // which must be computed in reverse order.
  reverseMap.forEach((queued, offsets) => {
    queued.bottom?.reverse().forEach(([state, offset]) => {
      state.bottom = offsets.bottom - offset;
      offsets.bottom += state.size.blockSize;
    });
    queued.right?.reverse().forEach(([state, offset]) => {
      state.right = offsets.right - offset;
      offsets.right += state.size.inlineSize;
    });
  });
};

/** Gets a draft `PositionState` for the element. */
const draftPositionState = (
  positionsByElement: Map<Draft<HTMLElement>, Draft<PositionState>>,
  element: HTMLElement | null,
) => {
  const draft = positionsByElement.get(element as Draft<HTMLElement>);
  invariant(
    draft,
    `A draft state could not be created for the element ${String(element)}`,
  );
  return draft;
};

/**
 * Creates a `PositionState` from the given `initialState`
 * that is bound to the given `set` function and `element`.
 */
const createBoundPositionState = (
  initialState: Draft<PositionState>,
  element: HTMLElement,
  set: (produce: (draft: Draft<PositionStore>) => void) => void,
): Draft<PositionState> => ({
  ...initialState,
  setSize: (produce: (draft: Draft<BorderBoxSize>) => void) => {
    set(({positionsByElement}) => {
      // Produce a draft of the next size state for this element.
      const draft = draftPositionState(positionsByElement, element);
      produce(draft.size);
      // Update the auto position states.
      if (draft.top === 'auto') {
        draft.autoTop = true;
        delete draft.top;
      }
      if (draft.right === 'auto') {
        draft.autoRight = true;
        delete draft.right;
      }
      if (draft.bottom === 'auto') {
        draft.autoBottom = true;
        delete draft.bottom;
      }
      if (draft.left === 'auto') {
        draft.autoLeft = true;
        delete draft.left;
      }
      // Update all of the position states in the same root.
      const root = rootsByElement.get(element);
      if (!root) return;
      const elementSet = elementsByRoot.get(root);
      if (!elementSet?.size) return;
      updatePositions(positionsByElement, elementSet, root);
    });
  },
  setPosition: (produce: (draft: Draft<Position>) => void) => {
    set(({positionsByElement}) => {
      const draft = draftPositionState(positionsByElement, element);
      // Produce a draft of the next position state for this element.
      produce(draft);
      // Remove any of the next positions that are auto positions.
      // The auto properties will be calculated in `updatePositions`.
      draft.autoTop = draft.top === 'auto';
      draft.autoRight = draft.right === 'auto';
      draft.autoBottom = draft.bottom === 'auto';
      draft.autoLeft = draft.left === 'auto';
      if (draft.autoTop) delete draft.top;
      if (draft.autoRight) delete draft.right;
      if (draft.autoBottom) delete draft.bottom;
      if (draft.autoLeft) delete draft.left;

      // Update all of the position states in the same root.
      const root = rootsByElement.get(element);
      if (!root) return;
      const elementSet = elementsByRoot.get(root);
      if (!elementSet?.size) return;
      updatePositions(positionsByElement, elementSet, root);
    });
  },
});

/**
 * The global `PositionStore` tracks positions
 * by element across the entire application.
 */
const usePositionStore = createStore<PositionStore>((set) => {
  return {
    positionsByElement: new Map(),
    add: (
      element: HTMLElement,
      root: HTMLElement,
      initialState: PositionState,
    ) => {
      const elementSet = elementsByRoot.get(root) ?? new Set();
      elementSet.add(element);
      elementsByRoot.set(root, elementSet);
      rootsByElement.set(element, root);

      const draft = createBoundPositionState(initialState, element, set);
      // Remove any of the intial positions that are auto positions.
      // The auto properties will be calculated in `updatePositions`.
      draft.autoTop = draft.top === 'auto';
      draft.autoRight = draft.right === 'auto';
      draft.autoBottom = draft.bottom === 'auto';
      draft.autoLeft = draft.left === 'auto';
      if (draft.autoTop) delete draft.top;
      if (draft.autoRight) delete draft.right;
      if (draft.autoBottom) delete draft.bottom;
      if (draft.autoLeft) delete draft.left;

      set(({positionsByElement}) => {
        positionsByElement.set(element as Draft<HTMLElement>, draft);
        // Update all of the position states in the same root.
        updatePositions(positionsByElement, elementSet, root);
      });
      /** Cleanup the element position state. */
      return function remove() {
        if (root && element) {
          elementsByRoot.get(root)?.delete(element);
          rootsByElement.delete(element);
          const remainingElementSet = elementsByRoot.get(root);
          set(({positionsByElement}) => {
            positionsByElement.delete(element as Draft<HTMLElement>);
            if (remainingElementSet?.size) {
              updatePositions(positionsByElement, remainingElementSet, root);
            }
          });
        }
      };
    },
  };
});

/**
 * `useAutoPosition` accepts an element and a position config, and returns
 * a position state that includes computed values for any position properties
 * that are configured as `'auto'`.
 *
 * The position properties `{top, right, bottom, left}` can be numbers,
 * pixel values, percentages, or `auto`. They may also be responsive arrays
 * of any of the same types.
 *
 * For any property that is configured `auto`, when the configured `position`
 * is `'fixed'` or `'sticky'`, the computed position will be calculated
 * to offset the element from other elements auto fixed or sticky to the
 * same root for the same property.
 *
 * Any properties that are not `auto` will be merged with the computed state.
 */
export function useAutoPosition(
  element: HTMLElement | null,
  {position, top, right, bottom, left}: Position,
): PositionState {
  /**
   * The initial `PositionState`.
   *
   * We need this to be defined on first render because the
   * position state won't be computed until after the first layout.
   *
   * We `useState` to avoid creating this more than once.
   */
  const [initialState] = useState<PositionState>(() => {
    const state = {
      position,
      top,
      right,
      bottom,
      left,
      size: {blockSize: 0, inlineSize: 0},
      autoTop: top === 'auto',
      autoRight: right === 'auto',
      autoBottom: bottom === 'auto',
      autoLeft: left === 'auto',
    };
    if (state.autoTop) delete state.top;
    if (state.autoRight) delete state.right;
    if (state.autoBottom) delete state.bottom;
    if (state.autoLeft) delete state.left;
    return state as PositionState;
  });

  const root = useMemo(() => getNearestPositionedAncestor(element), [element]);

  /** Add the element to the position store. */
  const add = usePositionStore((state) => state.add);
  useLayoutEffect(() => {
    if (element && root) return add(element, root, initialState);
  }, [element, root, add, initialState]);

  /** Update size state whenever the element size changes. */
  const setSize = usePositionStore(
    (state) => state.positionsByElement.get(element as HTMLElement)?.setSize,
  );
  useSize(({borderBoxSize}: Size) => {
    setSize?.((value) => void Object.assign(value, borderBoxSize));
  })(element);

  /** Update position state whenever the config changes. */
  const setPositionState = usePositionStore(
    (state) =>
      state.positionsByElement.get(element as HTMLElement)?.setPosition,
  );
  useEffect(() => {
    setPositionState?.((value) => {
      value.position = position ?? value.position;
      value.top = top ?? value.top;
      value.right = right ?? value.right;
      value.bottom = bottom ?? value.bottom;
      value.left = left ?? value.left;
    });
  }, [position, top, right, bottom, left, setPositionState]);

  /** The current position state, as computed by the position store. */
  return usePositionStore(
    useCallback(
      (state) =>
        state.positionsByElement.get(element as HTMLElement) ?? initialState,
      [element, initialState],
    ),
  );
}
