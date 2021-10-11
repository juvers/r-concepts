module.exports = {
  name: "generalInquiry",
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
      title: "Message",
      name: "message",
    },
  ],
  options: {
    integrations: [
      {
        name: 'sendgrid',
        options: {
          to: ['info@topoftherocknyc.com'],
          from: 'no-reply@rockefellercenter.com',
          subject: 'General Inquiry'
        }
      },
    ]
  }
}
