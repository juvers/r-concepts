module.exports = {
  name: "newsStandStudioInquirySection",
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
      title: "Describe Your Idea",
      name: "message",
    },
  ],
  options: {
    integrations: [
      {
        name: 'sendgrid',
        options: {
          to: ['lsimpson@tishmanspeyer.com'],
          from: 'no-reply@rockefellercenter.com',
          subject: 'Newsstand Studio Inquiry'
        }
      },
    ]
  }
}
