/**@jsx jsx */
import {jsx, Button, SxStyleProp} from '@tishman/components';
import {useEffect, useState, SyntheticEvent} from 'react';
import userStore from '~buy-tickets/store/user/userStore';

interface ContinueButtonProps {
  handleClick: () => void;
  className?: string;
  title?: string;
  sx?: SxStyleProp;
}

/**Continue Button advances from current step to next step.
 * It is only active once canContinue is set to true from
 * a step component.
 */
export const ContinueButton = ({
  sx,
  title = 'Continue',
  className,
  handleClick,
}: ContinueButtonProps): JSX.Element => {
  const [userState, setUserState] = useState(userStore.initialState);

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    return () => userSub.unsubscribe();
  }, []);

  return (
    <Button
      variant="inverted"
      disabled={!userState.canContinue}
      className={className}
      sx={{...sx}}
      onClick={(e: SyntheticEvent) => {
        e.preventDefault();
        handleClick();
      }}
    >
      {title}
    </Button>
  );
};
