/* eslint-disable @tishman/prefer-tishman-components */
/** @jsx jsx */
import {jsx, Select} from 'theme-ui';
import {useActiveTheme} from '~gatsby-theme-docz';
import {themes} from '~gatsby-theme-docz/theme';

interface ThemeSelectProps {
  inverted?: boolean;
}

export default function ThemeSelect({inverted}: ThemeSelectProps): JSX.Element {
  const [theme, setTheme] = useActiveTheme();

  const changeTheme = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const {value} = event.target;
    setTheme(value as Parameters<typeof setTheme>[0]);
  };

  return (
    <Select
      value={theme}
      onChange={changeTheme}
      variant={inverted ? 'select.inverted' : undefined}
    >
      {Object.keys(themes).map((theme) => (
        <option key={theme} value={theme}>
          {theme}
        </option>
      ))}
    </Select>
  );
}
