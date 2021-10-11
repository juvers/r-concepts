module.exports = {
  name: "filmPhotoInquiry",
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
      title: "Purpose of the shoot",
      name: "shootpurpose",
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
      title: "Load in time",
      name: "loadintime",
    },
    {
      title: "Load out time",
      name: "loadouttime",
    },
    {
      title: "Proposed Location",
      name: "location",
    },
    {
      title: "Type of Shoot",
      name: "shoottype",
    },
    {
      title: "Number of People (Approx.)",
      name: "peoplecount",
    },
  ],
  options: {
    integrations: [
      {
        name: 'mailchimp',
        options: {
          tags: ['SOURCE:ContactForm'],
          customFields: {
            SOURCE: 'ContactForm',
          },
        },
      },
      {
        name: 'sendgrid',
        options: {
          to: [
            "RCFilmandphoto@tishmanspeyer.com"
          ],
          from: 'no-reply@rockefellercenter.com',
          subject: 'Filming Request Inquiry'
        }
      },
    ],
  },
}
