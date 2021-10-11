/** @jsx jsx */
import {FluidObject} from 'gatsby-image';
import {useEffect, useState} from 'react';
import {
  jsx,
  Box,
  fluidFontSize,
  IntrinsicImage,
  useResponsiveValue,
  useFontLoadingStage,
} from '@tishman/components';
import {IntroOverlay} from './IntroOverlay';
import {H} from '@hzdg/sectioning';
import {a, config, useTrail} from 'react-spring';

export interface HomeHeroProps {
  /** Home Hero Title */
  title: string;
  /** Home Hero fluid image object */
  image?: {
    alt?: string | null;
    asset?: {
      fluid?: FluidObject;
    };
  };
  video?: {
    videoFile?: {
      asset?: {
        title?: string;
        url?: string;
      } | null;
    };
  };
}

const HomeHero = ({title, image, video}: HomeHeroProps): JSX.Element => {
  const canShowIntro = useResponsiveValue([false, true]);
  const fontReady = useFontLoadingStage() === 'loaded';
  const [imgReady, setImgReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [canShowMarquee, setCanShowMarquee] = useState(false);
  /**
   * `shouldShowIntro` differs from `canShowIntro` in that
   * `canShowIntro` indicates if the screen size is wide enough
   * to accommodate the intro animation, while `shouldShowIntro`
   * is computed from that bit plus whether or not the intro
   * has been shown yet (`introDone`).
   *
   * Note that we update `shouldShowIntro` in an effect to account for
   * hydration behavior. Since the initial value for `canShowIntro`
   * will be `false` (SSR default), we want the intro initially visible
   * (technically, it appears empty) to avoid any flashes of
   * the intro-revealed image content. Once mounted, `canShowIntro`
   * will update to match the screen size, and the effect will then
   * update `shouldShowIntro` accordingly.
   */
  const [shouldShowIntro, setShouldShowIntro] = useState(true);

  const mobileLineBreakToken = '/mlb';
  const words = title
    .split(' ')
    .slice(0, 2)
    .concat(mobileLineBreakToken, ...title.split(' ').slice(2));

  useEffect(() => {
    setShouldShowIntro(canShowIntro && !introDone);
  }, [canShowIntro, introDone]);

  const [trails, animate] = useTrail(words.length, () => ({
    config: {...config.gentle, clamp: true},
    opacity: 0,
    y: -30,
  }));

  useEffect(() => {
    if (introDone && canShowMarquee) animate({y: 0, opacity: 1});
  }, [introDone, canShowMarquee, animate]);

  useEffect(() => {
    video &&
      video.videoFile &&
      video.videoFile.asset &&
      video.videoFile.asset.url &&
      setImgReady(true);
  }, [video]);

  return (
    <Box sx={{position: 'relative', zIndex: 'content'}}>
      {shouldShowIntro && (
        <IntroOverlay
          text={title}
          play={fontReady && imgReady}
          onLeave={() => setCanShowMarquee(true)}
          onRest={() => setIntroDone(true)}
        />
      )}
      <H
        sx={{
          variant: 'text.heroTitle',
          justifyContent: 'center',
          fontSize: fluidFontSize(['30px', null, null, null, 10]),
          whiteSpace: ['normal', 'nowrap', 'nowrap'],
          display: 'flex',
          flexWrap: 'wrap',
          mb: [-1, -2, -2, '-10px', -3],
        }}
      >
        {trails.map((props, index) =>
          words[index] === mobileLineBreakToken ? (
            <a.span
              key={`word-${index}`}
              sx={{
                opacity: 1,
                '@media (max-width: 639px)': {
                  flexBasis: '100%',
                  height: 0,
                },
              }}
            ></a.span>
          ) : (
            <a.span
              key={`word-${index}`}
              style={canShowIntro ? props : {opacity: 1, y: 0}}
            >
              {words[index]}&nbsp;
            </a.span>
          ),
        )}
      </H>
      <Box
        sx={{
          position: 'relative',
          pb: [`${(222 / 320) * 100}%`, `${(500 / 1445) * 100}%`],
          overflow: 'hidden',
          zIndex: 'background',
        }}
      >
        <Box sx={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
          {image && image.asset && image.alt && (
            <IntrinsicImage
              ratio={[320 / 222, 1445 / 500]}
              fluid={image.asset.fluid}
              alt={image.alt}
              onLoad={() => setImgReady(true)}
            />
          )}
          {video &&
            video.videoFile &&
            video.videoFile.asset &&
            video.videoFile.asset.url && (
              <video
                width="100%"
                height="100%"
                autoPlay
                loop
                muted
                playsInline
                sx={{objectFit: 'cover', objectPosition: 'center'}}
              >
                <source src={video.videoFile.asset.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
        </Box>
      </Box>
    </Box>
  );
};

export default HomeHero;
