/** @jsx jsx */
import {jsx} from '@tishman/components';
import {Layout} from '~layouts';
import NewsstandStudiosHeroBlock from '~blocks/NewsstandStudiosHeroBlock';
import NewsstandStudiosPodcastListBlock from '~blocks/NewsstandStudiosPodcastListBlock';
import NewsstandStudiosCalloutGridBlock from '~blocks/NewsstandStudiosCalloutGridBlock';
import NewsstandStudiosInquiryFormBlock from '~blocks/NewsstandStudiosInquiryFormBlock';
import ShareYourExperienceBlock from '~blocks/ShareYourExperienceBlock';
import {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Medium_Yellow',
  pageName: '',
  logo: 'Newsstand studios',
  cta: {to: '/contact/newsstand-studio-inquiries', label: 'Inquire'},
};

export default function NewsstandStudiosPage(): JSX.Element {
  return (
    <Layout theme="Rock Center Medium_Yellow">
      <NewsstandStudiosHeroBlock />
      <NewsstandStudiosCalloutGridBlock />
      <NewsstandStudiosPodcastListBlock theme="Rock Center" cta={config.cta} />
      <NewsstandStudiosInquiryFormBlock />
      <ShareYourExperienceBlock
        theme="Rock Center Cream"
        hashTags={['#rockefellercenter', '#rockcenter', '#rockefellerplaza']}
        labels={['rockefellercenter', 'rockcenter', 'rockefellerplaza']}
      />
    </Layout>
  );
}
