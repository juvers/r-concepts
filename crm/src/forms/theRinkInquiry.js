module.exports = {
  name: "theRinkInquiry",
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
          to: ['therink@rockefellercenter.com'],
          from: 'no-reply@rockefellercenter.com',
          subject: 'Your Rink Inquiry'
        }
      },
    ]
  }
}
