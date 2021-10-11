import React from 'react';
import {graphql} from 'gatsby';
import GeneralInquiriesForm from './general-inquiries';
import type {PageConfig} from '~PageConfig';

export const config: PageConfig = {
  theme: 'Rock Center Black',
  logo: 'Rockefeller Center',
  pageName: 'Contact Us',
  cta: {
    to: '/buy-tickets',
    label: 'Buy Tickets',
  },
};

export const query = graphql`
  query ContactLandingPage {
    meta: formJson(id: {eq: "general-inquiry-form"}) {
      meta {
        title
        description
      }
    }
    formJson(id: {eq: "general-inquiry-form"}) {
      id
      integrationId
      name
      slug
      description {
        text
        image {
          id
          fluid {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
      thankYouMessage {
        title
        caption
        links {
          url
          label
        }
      }
    }
  }
`;

const ContactLandingPage = ({
  data,
}: {
  data: GatsbyTypes.ContactLandingPageQuery;
}): JSX.Element => {
  return <GeneralInquiriesForm data={data} />;
};

export default ContactLandingPage;
