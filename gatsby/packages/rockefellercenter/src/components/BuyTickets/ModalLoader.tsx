/**@jsx jsx */
import {jsx, Box, RockefellerCenterLogoSvg} from '@tishman/components';
import {useSpring, animated} from 'react-spring';

interface LoaderProps {
  opacity?: number;
}

export const ModalLoader = ({opacity = 0.8}: LoaderProps): JSX.Element => {
  const wipe = useSpring({
    loop: true,
    from: {
      height: '0px',
    },
    to: {
      height: '157px',
    },
    config: {duration: 600},
    delay: 1000,
  });
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: `rgba(255, 255, 255, ${opacity})`,
        zIndex: 'sticky',
      }}
    >
      <animated.div
        sx={{
          left: '50%',
          width: '307px',
          top: '50%',
          height: '0px',
          position: 'absolute',
          marginLeft: '-153px',
          marginTop: '-78px',
          overflow: 'hidden',
        }}
        style={wipe}
      >
        <RockefellerCenterLogoSvg />
      </animated.div>
    </Box>
  );
};
