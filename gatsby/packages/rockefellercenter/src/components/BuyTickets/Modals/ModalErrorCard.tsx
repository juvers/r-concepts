/** @jsx jsx */
import {jsx, Box, Flex, Text} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {ModalContainer} from './ModalContainer';

export const ModalErrorCard = ({
  closeModal,
  title,
  description,
}: {
  title: string;
  description: string;
  closeModal: () => void;
}): JSX.Element => {
  return (
    <ModalContainer closeModal={closeModal}>
      <Box
        sx={{
          py: [4, 5, 7],
          pb: [4, 5, 8],
          px: [4, 6],
        }}
      >
        <Flex>
          <Flex
            sx={{
              height: 25,
              width: 25,
              bg: 'error',
              borderRadius: '50%',
              justifyContent: 'center',
              alignItems: 'center',
              px: [2, 10],
              mr: 3,
              mt: 1,
            }}
          >
            <Text
              sx={{
                variant: 'text.mediumTitle',
                fontSize: 3,
                color: 'background',
              }}
            >
              !
            </Text>
          </Flex>
          <H
            sx={{
              variant: 'text.mediumTitle',
              fontSize: [5, 6],
            }}
          >
            {title}
          </H>
        </Flex>
        <Text sx={{variant: 'text.mediumP', mt: 3, pt: 1}}>{description}</Text>
      </Box>
    </ModalContainer>
  );
};
