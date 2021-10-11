module.exports = {
  name: "partnershipInquirySection",
  fields: [
    {
      title: "Full Name",
      name: "fullname",
    },
    {
      title: "Email",
      name: "email",
    },
    {
      title: "Phone Number",
      name: "phone",
    },
    {
      title: "Company or Affiliation",
      name: "company",
    },
    {
      title: "Start Date",
      name: "startdate",
    },
    {
      title: "End Date",
      name: "enddate",
    },
    {
      title: "Client Name",
      name: "client",
    },
    {
      title: "Location",
      name: "location",
    },
    {
      title: "Comments",
      name: "comments",
    },
  ],
  options: {
    integrations: [
      {
        name: 'mailchimp',
        options: {
          tags: ['Source:PARTNERSHIPS'],
          customFields: {
            SOURCE: 'PARTNERSHIPS',
          },
        },
      },
      {
        name: "sendgrid",
        options: {
          to: [
            "sponsorship@tishmanspeyer.com",
            "lsimpson@tishmanspeyer.com",
            "RCPartnerships@tishmanspeyer.com",
          ],
          from: "no-reply@rockefellercenter.com",
          subject: "Partnerships Inquiry",
        },
      },
    ],
  },
};
