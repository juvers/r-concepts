/** @jsx jsx */
import {jsx, Button} from '@tishman/components';

export interface SubmitButtonProps {
  text: string;
  disabled: boolean;
}

export const SubmitButton = ({
  text,
  disabled,
}: SubmitButtonProps): JSX.Element => {
  return (
    <Button type="submit" disabled={disabled} variant="submit">
      {text}
    </Button>
  );
};

export default SubmitButton;
