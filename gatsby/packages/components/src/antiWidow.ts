import {Children, isValidElement, cloneElement} from 'react';

import type {ReactNode} from 'react';

// Finds the last space (including a non-breaking space) before a non-space
// character in a string. It will be replaced with a non-breaking space, which
// is One Simple Trick™ to prevent widows in text.
const TO_REPLACE = /[\s\u00A0]([^\s\u00A0]+[\s\u00A0]*$)/;

/**
 * `antiWidow` prevents inline content from 'widowing' a
 * single block on the last line when wrapping.
 *
 * It does this by inserting a non-breaking space between
 * the last two words of the block.
 *
 * It also works on complex (rich text) content by walking
 * the last branch of React nodes until it finds text to apply.
 */
export function antiWidow(value: ReactNode): ReactNode {
  if (typeof value === 'string') {
    // Replace the last space with a non-breaking space.
    return value.replace(TO_REPLACE, '\u00A0$1');
  } else if (isValidElement(value) && value.props.children) {
    let newChildren;
    const {children} = value.props;
    if (Array.isArray(children)) {
      newChildren = Children.map(children, (child) => antiWidow(child));
    } else {
      newChildren = antiWidow(children);
    }
    return cloneElement(value, {children: newChildren});
  } else {
    return value;
  }
}
