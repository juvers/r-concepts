/** @jsx jsx */

import {H} from '@hzdg/sectioning';
import {Fragment} from 'react';
import {jsx, Container, Box, Text, Link} from '@tishman/components';

export interface ShareYourExperienceBlockHeaderProps {
  title?: string;
  hashTags?: string[];
}

const ShareYourExperienceBlockHeader = ({
  title = 'Share your experience.',
  hashTags = ['#RainbowRoom', '#RainbowRoomNYC', '#BarSixtyFive', '#RockEats'],
}: ShareYourExperienceBlockHeaderProps): JSX.Element => {
  return (
    <Container sx={{maxWidth: 625}}>
      <H
        sx={{
          variant: 'text.mediumTitle',
          mb: 3,
        }}
      >
        {title}
      </H>
      <Box>
        <Text variant="mediumP" as="span">
          {`Use `}
        </Text>
        {hashTags.map((hashTag, i) => {
          const lastTag = i === hashTags.length - 1;
          const onlyTag = hashTags.length === 1;

          return (
            <Fragment key={hashTag}>
              {!onlyTag && lastTag && (
                <Text variant="mediumP" as="span">
                  {`or `}
                </Text>
              )}
              <Link
                sx={{variant: 'text.mediumP'}}
                target="_blank"
                href={`https://www.instagram.com/explore/tags/${hashTag.replace(
                  '#',
                  '',
                )}/`}
              >
                {hashTag}
              </Link>
              <Text variant="mediumP" as="span">
                {lastTag ? `.` : `, `}
              </Text>
            </Fragment>
          );
        })}
      </Box>
    </Container>
  );
};

export default ShareYourExperienceBlockHeader;
