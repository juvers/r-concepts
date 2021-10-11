/** @jsx jsx */
import {jsx, Box, Text} from '@tishman/components';
import {alpha} from '@theme-ui/color';

export interface RequiredLabelProps {
  labelText: string;
}

export const RequiredLabel = ({
  labelText = 'Required*',
}: RequiredLabelProps): JSX.Element => {
  return (
    <Box>
      <Text sx={{color: alpha('text', 0.4)}}>{labelText}</Text>
    </Box>
  );
};

export default RequiredLabel;
