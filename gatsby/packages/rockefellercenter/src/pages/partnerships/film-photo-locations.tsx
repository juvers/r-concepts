/** @jsx jsx */
import {jsx} from '@tishman/components';
import {graphql} from 'gatsby';
import {Layout} from '~layouts';
import FilmPhotoHeroBlock from '~blocks/FilmPhotoHeroBlock';
import FilmPhotoCalloutGridBlock from '~blocks/FilmPhotoCalloutGridBlock';
import FilmPhotoCommunityFeaturedGalleryBlock from '~blocks/FilmPhotoCommunityFeaturedGalleryBlock';
import FilmPhotoImageCalloutBlock from '~blocks/FilmPhotoImageCalloutBlock';
import FilmPhotoInquiryFormBlock from '~blocks/FilmPhotoInquiryFormBlock';
import FilmPhotoWideCtaBlock from '~blocks/FilmPhotoWideCtaBlock';
import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Cream',
  logo: 'Rockefeller Center',
  pageName: 'Film & Photo',
  cta: {
    to: '/contact/film-photo',
    label: 'Inquire',
  },
};

export const query = graphql`
  query FilmPhotoMeta {
    meta: dataJson(id: {eq: "film-photo"}) {
      meta {
        title
        description
      }
    }
  }
`;

export default function FilmPhotoPage(): JSX.Element {
  return (
    <Layout theme="Rock Center Cream">
      <FilmPhotoHeroBlock id="film-photo-intro" theme="Rock Center Cream" />
      <FilmPhotoCalloutGridBlock
        id="film-photo-callout-grid"
        theme="Rock Center Black"
      />
      <FilmPhotoCommunityFeaturedGalleryBlock
        id="film-photo-featured-gallery"
        theme="Rock Center"
      />
      <FilmPhotoInquiryFormBlock theme="Rock Center Green" />
      <FilmPhotoWideCtaBlock theme="Rock Center" id="film-photo-wide-cta" />
      <FilmPhotoImageCalloutBlock
        id="film-photo-image-callout"
        theme="Rock Center Cream"
      />
    </Layout>
  );
}
