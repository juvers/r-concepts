module.exports = {
  name: "pressInquiry",
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
      title: "Title",
      name: "title",
    },
    {
      title: "Message",
      name: "message",
    },
  ],
  options: {
    integrations: [
      {
        name: 'sendgrid',
        options: {
          to: [
            'RCFilmandphoto@tishmanspeyer.com'
          ],
          from: 'no-reply@rockefellercenter.com',
          subject: 'Media Request Inquiry'
        }
      },
    ]
  }
}
