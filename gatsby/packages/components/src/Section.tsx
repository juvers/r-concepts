/** @jsx jsx */
import {forwardRef} from 'react';
import {jsx, ThemeProvider, Box} from '@tishman/components';
import {Section as HzSection} from '@hzdg/sectioning';
import {getThemeByName} from '~themes';

import type {ComponentProps} from 'react';
import type {
  TishmanThemeName,
  ThemeUIComponentProps,
} from '@tishman/components';

export type SectionProps = ThemeUIComponentProps<
  undefined,
  'section',
  {
    /** The name of the theme to be used for this section. */
    theme?: TishmanThemeName;
    /** Components to be used for this section. */
    components?: ComponentProps<typeof ThemeProvider>['components'];
    /**
     * Sets ID on section to be used for anchor links
     */
    id?: string;
  }
>;

export const Section = forwardRef(function Section(
  {
    bg = 'background',
    color = 'text',
    theme,
    components,
    ...props
  }: SectionProps,
  forwardedRef: SectionProps['ref'],
) {
  const sectionElement = (
    <Box ref={forwardedRef} as={HzSection} bg={bg} color={color} {...props} />
  );
  return theme || components ? (
    <ThemeProvider
      theme={theme ? getThemeByName(theme) : {}}
      components={components}
    >
      {sectionElement}
    </ThemeProvider>
  ) : (
    sectionElement
  );
});
