module.exports = {
  name: "privateEventsNewsletter",
  fields: [
    {
      title: "Email",
      name: "email",
      required: true,
    },
  ],
  options: {
    integrations: [
      {
        name: 'mailchimp',
        options: {
          tags: ['Source:PRIVATEEVENTS'],
          interests: {
            'a99f72e12c': true,
          },
          customFields: {
            SOURCE: 'PRIVATEEVENTS',
          },
        },
      },
    ]
  }
}
