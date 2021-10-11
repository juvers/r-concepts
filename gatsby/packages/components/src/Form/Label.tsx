/** @jsx jsx */
import {Label as ThemeUILabel} from 'theme-ui';

import type {ComponentProps} from 'react';
import type {ThemeUIComponent} from '~theme-ui';

/**
 * Label variants can be defined in `theme.forms`
 * and the component uses the `theme.forms.label` variant by default.
 * @see https://theme-ui.com/components/label/
 */
export const Label = ThemeUILabel as ThemeUIComponent<'forms', 'label'>;

export type LabelProps = ComponentProps<typeof Label>;
