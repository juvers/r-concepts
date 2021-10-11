/** @jsx jsx */
import {
  jsx,
  Box,
  Text,
  Flex,
  IntrinsicImage,
  Link,
  Button,
  ClockSvg,
  ThemeProvider,
  getThemeByName,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {FluidObject} from 'gatsby-image';
import {ModalContainer} from './ModalContainer';

interface BuyTicketsModal {
  title: string;
  subTitle: string;
  description: string;
  cta?: {
    label: string;
    url: string;
  };
  link?: {
    label: string;
    url: string;
  };
  fluid?: FluidObject;
  alt?: string;
  closeModal: () => void;
  showCloseLink?: boolean;
  icon?: boolean;
}

export const ModalCard = ({
  closeModal,
  title,
  subTitle,
  description,
  cta,
  link,
  fluid,
  alt,
  showCloseLink = true,
  icon,
}: BuyTicketsModal): JSX.Element => {
  return (
    <ModalContainer closeModal={closeModal}>
      <Box
        sx={{
          py: [4, 5, 7],
          pb: [4, 5, 8],
          px: [4, 6],
        }}
      >
        <Flex sx={{alignItems: 'center'}}>
          {icon && (
            <ThemeProvider theme={getThemeByName('Top of the Rock Blue')}>
              <ClockSvg sx={{color: 'background'}} />
            </ThemeProvider>
          )}
          <H
            sx={{
              ml: icon ? 2 : 0,
              variant: 'text.mediumTitle',
            }}
          >
            {title}
          </H>
        </Flex>
        <Text sx={{variant: 'styles.h5'}}>{subTitle}</Text>
        <Text sx={{variant: 'text.mediumP', mt: 3, pt: 1}}>{description}</Text>
        <Flex
          sx={{
            mt: 5,
            flexDirection: 'column',
            width: 'fit-content',
            alignItems: 'center',
          }}
        >
          {cta && (
            <Link variant="buttonInverted" href={cta?.url}>
              {cta?.label}
            </Link>
          )}
          <Flex
            sx={{
              mt: 3,
              justifyContent: link ? 'flex-start' : 'center',
              width: '100%',
            }}
          >
            {link && (
              <Link
                variant="underline"
                target="_blank"
                href={link?.url}
                sx={{mr: 3}}
              >
                {link?.label}
              </Link>
            )}
            {showCloseLink && (
              <Button variant="underline" onClick={closeModal} sx={{ml: 2}}>
                No thank you
              </Button>
            )}
          </Flex>
        </Flex>
      </Box>
      {fluid && (
        <Box>
          <IntrinsicImage alt={alt} fluid={fluid} />
        </Box>
      )}
    </ModalContainer>
  );
};
