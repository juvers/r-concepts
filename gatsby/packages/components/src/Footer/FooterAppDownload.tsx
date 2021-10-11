/**@jsx jsx */
import Img from 'gatsby-image';
import {jsx, Box, Flex, Text, Link} from '@tishman/components';

import type {FluidObject} from 'gatsby-image';

export interface FooterAppDownloadProps {
  appStore: {
    link: string;
    image: FluidObject;
  };
  googlePlay: {
    link: string;
    image: FluidObject;
  };
}

const imgStyle = {
  width: ['131px', '181px'],
  height: ['50px', '69px'],
};

export const FooterAppDownload = ({
  appStore,
  googlePlay,
}: FooterAppDownloadProps): JSX.Element => (
  <Box sx={{mt: [4, null, null, 0]}}>
    <Text variant="footerHeading">Download the App</Text>
    <Flex>
      <Link to={appStore.link} sx={{mr: 3}}>
        <Img
          key="apple"
          sx={imgStyle}
          fluid={appStore.image}
          alt="Download the app from the apple app store"
        />
      </Link>
      <Link to={googlePlay.link}>
        <Img
          key="google"
          sx={imgStyle}
          fluid={googlePlay.image}
          alt="Download the app from the google play store"
        />
      </Link>
    </Flex>
  </Box>
);
