module.exports = {
  name: "leasingNewsletter",
  fields: [
    {
      title: "Email",
      name: "email",
      required: true,
    }
  ],
  options: {
    integrations: [
      {
        name: 'mailchimp',
        options: {
          tags: ['Source:LEASING'],
          customFields: {
            SOURCE: 'LEASING',
          },
        },
      },
    ]
  }
}
