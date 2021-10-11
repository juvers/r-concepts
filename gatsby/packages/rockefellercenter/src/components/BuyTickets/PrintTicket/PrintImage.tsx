/**@jsx jsx */
import {jsx, Box, IntrinsicBox} from '@tishman/components';

interface PrintImageProps {
  src: string;
}

export const PrintImage = ({src}: PrintImageProps): JSX.Element => {
  return (
    <Box
      sx={{
        position: 'relative',
        borderRight: 'dashed 1px #333',
        p: [2, 4, 6],
        '@media print': {
          py: 4,
          pl: 4,
          pr: 5,
        },
      }}
    >
      {src && (
        <IntrinsicBox ratio={904 / 1280}>
          <img width="100%" src={src} alt="Ticket" />
        </IntrinsicBox>
      )}
    </Box>
  );
};
