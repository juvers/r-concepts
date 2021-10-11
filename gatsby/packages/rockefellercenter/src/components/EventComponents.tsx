/** @jsx jsx */
import {
  jsx,
  SanityRichTextProps,
  IntrinsicBox,
  VideoProps,
} from '@tishman/components';

/**
 * Get Vimeo ID from various Vimeo URL
 */
function getVimeoId(url: string): string {
  const vimeoRegex = /([0-9a-z\-_]+)$/i;
  return vimeoRegex.exec(url)?.[0] ?? 'Invalid vimeo id';
}

const EventVimeoBlock = ({node}: VideoProps): JSX.Element => {
  const vimeoId = getVimeoId(node.url);
  return (
    <IntrinsicBox ratio={1280 / 680} sx={{my: [6, 8], position: 'relative'}}>
      <iframe
        title={`vimeo iframe ${vimeoId}`}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        src={`https://player.vimeo.com/video/${vimeoId}`}
      ></iframe>
    </IntrinsicBox>
  );
};

/**
 * Get YouTube ID from various YouTube URL
 */
function getYoutubeId(url: string): string {
  const urlArray = url
    .replace(/(>|<)/gi, '')
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  return urlArray[2] !== undefined
    ? urlArray[2].split(/[^0-9a-z_-]/i)[0]
    : urlArray[0];
}

const EventYoutubeBlock = ({node}: VideoProps): JSX.Element => {
  const youtubeId = getYoutubeId(node.url);
  return (
    <IntrinsicBox ratio={1280 / 680} sx={{my: [6, 8], position: 'relative'}}>
      <iframe
        title={`youtube iframe ${youtubeId}`}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        src={`https://www.youtube.com/embed/${youtubeId}`}
      ></iframe>
    </IntrinsicBox>
  );
};

export const eventComponents: SanityRichTextProps['components'] = {
  vimeoBlock: EventVimeoBlock,
  youtubeBlock: EventYoutubeBlock,
};
