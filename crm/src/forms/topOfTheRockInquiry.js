module.exports = {
  name: "topOfTheRockInquiry",
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
      title: "Comments",
      name: "comments",
    },
  ],
  options: {
    integrations: [
      {
        name: 'sendgrid',
        options: {
          to: ['info@topoftherocknyc.com'],
          from: 'no-reply@rockefellercenter.com',
          subject: 'Top of the Rock Inquiry'
        }
      },
    ]
  }
}
