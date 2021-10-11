module.exports = {
  name: "rrBarSixtyFiveNewsletter",
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
          tags: ['Source:RAINBOWROOM_65'],
          interests: {
            '6748d8b85b': true,
          },
          customFields: {
            SOURCE: 'RAINBOWROOM_65',
          },
        },
      }
    ],
  }
}
