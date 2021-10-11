export type SanityVideoType = Pick<
  GatsbyTypes.SanityAmbientVideoType,
  'videoFile'
>;

export interface SanityVideoProps {
  movieUrl: string;
}

export const getSanityVideoProps = (
  item?: SanityVideoType,
): SanityVideoProps => {
  if (!item?.videoFile?.asset?.url)
    throw new Error('Expected sanity video object');
  return {movieUrl: item.videoFile.asset.url};
};
