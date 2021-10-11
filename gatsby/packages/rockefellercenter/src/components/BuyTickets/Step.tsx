/**@jsx jsx */
import {jsx, Container, Flex, Box, Link} from '@tishman/components';
import {ModalLoader} from '~components/BuyTickets';
import {H} from '@hzdg/sectioning';
import {useEffect, useState, SyntheticEvent} from 'react';
import userStore from '~buy-tickets/store/user/userStore';

interface StepProps {
  title: string;
  summary?: JSX.Element;
  stepNumber: number;
  children: React.ReactNode;
  showLoadingModal?: boolean;
}

/**Step component renders the component used in that step
 * updates the step state and handles the step summary.
 */
export const Step = ({
  children,
  title,
  stepNumber,
  summary,
  showLoadingModal,
}: StepProps): JSX.Element => {
  const [userState, setUserState] = useState(userStore.initialState);

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    return () => userSub.unsubscribe();
  }, []);

  return (
    <Container
      sx={{
        maxWidth: 1040,
        pt: stepNumber === userState.currentStep ? 5 : 4,
        pb: summary || stepNumber === userState.currentStep ? 5 : 4,
        borderBottom: `1px solid #D8D8D8`,
        ':first-of-type': {
          pt: 0,
        },
        position: 'relative',
      }}
    >
      {showLoadingModal && <ModalLoader />}
      <H
        sx={{
          maxWidth: 346,
          variant: 'text.mediumTitle',
          mb: summary || stepNumber === userState.currentStep ? 3 : 0,
          color: !summary
            ? userState.currentStep < stepNumber
              ? 'backgroundDisabled'
              : 'initial'
            : 'initial',
        }}
      >
        {title}
      </H>
      {stepNumber === userState.currentStep ? (
        children
      ) : (
        <Flex sx={{justifyContent: 'space-between'}}>
          <Box>{summary}</Box>
          {summary && (
            <Link
              href="#"
              onClick={(e: SyntheticEvent) => {
                e.preventDefault();
                userStore.sendData({
                  currentStep: stepNumber,
                });
              }}
              sx={{variant: 'links.inline', fontWeight: 'medium'}}
            >
              Edit
            </Link>
          )}
        </Flex>
      )}
    </Container>
  );
};
