/** @jsx jsx */
import {Spinner as ThemeUISpinner} from 'theme-ui';

import type {ComponentProps} from 'react';
import type {ThemeUIComponent} from '~theme-ui';

export const Spinner = ThemeUISpinner as ThemeUIComponent<undefined, 'svg'>;

export type SpinnerProps = ComponentProps<typeof Spinner>;
