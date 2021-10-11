/** @jsx jsx */
import {jsx, Text, Button} from '@tishman/components';
import {useSprings, animated, config} from 'react-spring';
import {useOverlayTriggerState} from '@react-stately/overlays';
import useHover from '@hzdg/use-hover';

import type {OverlayTriggerProps} from '@react-types/overlays';
import type {ButtonProps} from '@tishman/components';

const interpolations = [
  // line1Point1
  {from: {x: -16, y: -3}, hover: {x: -16, y: -3}, open: {x: -16, y: -6}},
  // line1Point2
  {from: {x: 16, y: -3}, hover: {x: 0, y: -3}, open: {x: -4, y: 6}},
  // line2Point1
  {from: {x: -16, y: 3}, hover: {x: -16, y: 3}, open: {x: -16, y: 6}},
  // line2Point2
  {from: {x: 0, y: 3}, hover: {x: 16, y: 3}, open: {x: -4, y: -6}},
];

export interface MenuToggleButtonProps
  extends Omit<ButtonProps, 'ref'>,
    OverlayTriggerProps {
  /** An optional label for the button. Defaults to `'Menu'`. */
  label?: string;
  /** Whether the menu is open by default (controlled). */
  isOpen?: boolean;
  /** Whether the menu is open by default (uncontrolled). */
  defaultOpen?: boolean;
  /** Handler that is called when the menu's open state changes. */
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * An accessible, controllable toggle button that animates
 * between closed, hovered, and open states.
 *
 * The button uses `aria-lxpanded` to indicate that it reveals a hidden menu.
 *
 * @see https://www.accessibility-developer-guide.com/examples/sensible-aria-usage/expanded/
 */
export function MenuToggleButton({
  defaultOpen,
  isOpen: isOpenControlled,
  onOpenChange,
  sx,
  onClick,
  label = 'Menu',
  ...props
}: MenuToggleButtonProps): JSX.Element {
  const {isOpen, toggle} = useOverlayTriggerState({
    defaultOpen,
    isOpen: isOpenControlled,
    onOpenChange,
  });
  const [isHovering, hoverProps] = useHover();
  const [line1Point1, line1Point2, line2Point1, line2Point2] = useSprings(
    interpolations.length,
    interpolations.map(({from, hover, open}) => ({
      from,
      to: isOpen ? open : isHovering ? hover : from,
      config: config.stiff,
    })),
  );

  return (
    <Button
      variant="icon"
      sx={{display: 'flex', alignItems: 'center', ...sx}}
      onClick={(event) => {
        if (typeof onClick === 'function') onClick(event);
        if (!event.defaultPrevented) toggle();
      }}
      {...hoverProps}
      {...props}
      aria-expanded={isOpen}
      aria-label={label}
    >
      <Text aria-hidden mr={2} sx={{display: ['none', 'inherit']}}>
        {label}
      </Text>
      <svg
        aria-hidden
        viewBox="-16 -16 32 32"
        width="32px"
        height="32px"
        style={{stroke: 'currentColor'}}
      >
        <animated.line
          strokeWidth={2}
          x1={line1Point1.x}
          y1={line1Point1.y}
          x2={line1Point2.x}
          y2={line1Point2.y}
        />
        <animated.line
          strokeWidth={2}
          x1={line2Point1.x}
          y1={line2Point1.y}
          x2={line2Point2.x}
          y2={line2Point2.y}
        />
      </svg>
    </Button>
  );
}
