/** @jsx jsx */
import {useConfig, useCurrentDoc} from 'docz';

import * as styles from 'gatsby-theme-docz/src/components/Header/styles';
import {Edit, Menu, Github} from 'gatsby-theme-docz/src/components/Icons';
// eslint-disable-next-line @tishman/prefer-tishman-components
import {jsx, Box, Flex} from 'theme-ui';
import {RockefellerCenterLogoSvg as Logo} from '@tishman/components';
import ThemeSelect from '../../../style-guide/ThemeSelect';

interface HeaderProps {
  onOpen: React.MouseEventHandler<HTMLButtonElement>;
}

export const Header = (props: HeaderProps): JSX.Element => {
  const {onOpen} = props;
  const {
    repository,
    themeConfig: {showMarkdownEditButton},
  } = useConfig();
  const {edit = true, ...doc} = useCurrentDoc();

  return (
    <div sx={styles.wrapper} data-testid="header">
      <Box sx={styles.menuIcon}>
        <button sx={styles.menuButton} onClick={onOpen}>
          <Menu size={25} />
        </button>
      </Box>
      <div sx={{...styles.innerContainer, bg: 'background'}}>
        <Logo sx={{color: 'logo', height: '100%', width: 'auto', pt: 3}} />
        <Flex>
          {repository && (
            <Box sx={{mr: 2}}>
              <a
                href={repository}
                sx={styles.headerButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={15} sx={{color: 'logo'}} />
              </a>
            </Box>
          )}
          <ThemeSelect inverted />
        </Flex>
        {showMarkdownEditButton && edit && doc.link && (
          <a
            sx={styles.editButton}
            href={doc.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Edit width={14} />
            <Box sx={{pl: 2}}>Edit page</Box>
          </a>
        )}
      </div>
    </div>
  );
};
