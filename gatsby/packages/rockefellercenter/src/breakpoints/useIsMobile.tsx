import {useBreakpointIndex} from '@tishman/components';

const useIsMobile = (): boolean => {
  return useBreakpointIndex() < 1;
};

export default useIsMobile;
