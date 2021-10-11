module.exports = {
  name: "partnershipInquiry",
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
      name: "Start Date",
      name: "startdate",
    },
    {
      name: "End Date",
      name: "enddate",
    },
    {
      name: "Client Name",
      name: "client",
    },
    {
      name: "Location",
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
