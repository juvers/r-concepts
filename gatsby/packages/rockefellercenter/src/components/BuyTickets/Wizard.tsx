/**@jsx jsx */
import {jsx, Section, Container} from '@tishman/components';
import {ProgressTracker} from '~components/BuyTickets';

interface WizardProps {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
}

/**Wizard contains the progress tracker and all of the steps
 * for a given flow. It determines the total number of steps for a flow
 * and updates the progress tracker
 */
export const Wizard = ({
  children,
  currentStep,
  totalSteps,
}: WizardProps): JSX.Element => (
  <Section
    theme="Rock Center"
    sx={{
      width: '100%',
      bg: 'white',
      pt: [5, 8],
      pb: 6,
      display: 'flex',
    }}
  >
    <ProgressTracker steps={totalSteps} currentStep={currentStep} />
    <Container>{children}</Container>
  </Section>
);
