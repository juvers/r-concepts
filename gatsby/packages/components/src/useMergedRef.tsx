import {useCallback} from 'react';

import type {Ref, RefCallback, MutableRefObject} from 'react';

/**
 * `useMergedRef` will return a ref callback that, when called,
 * will update all of the provided refs with the given value.
 *
 * This is useful for various ref forwarding scenarios where you need
 * to forward a ref and also keep a local ref.
 *
 * @example
 *
 * const RefForwardingComponent = React.forwardRef((props, forwardedRef) => {
 *   const internalRef = useRef(null);
 *   const mergedRef = useMergedRef(forwardedRef, internalRef);
 *   return <div ref={mergedRef} />;
 * });
 */
export function useMergedRef<T>(
  ...refs: (Ref<T> | null | undefined)[]
): RefCallback<T> {
  return useCallback(
    (value: T): void => {
      for (const ref of refs) {
        if (typeof ref === 'function') {
          ref(value);
        } else if (ref && 'current' in ref) {
          (ref as MutableRefObject<T>).current = value;
        }
      }
    },
    // Our dependency list for this callback is simply the list
    // of arguments to the function. Since this can't be statically analyzed,
    // the linter yells at us for it, but we know better, don't we?
    // Sure we do.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}
