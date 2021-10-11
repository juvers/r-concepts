module.exports = {
  name: "filmAndPhotoNewsletter",
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
          tags: ['SOURCE:FilmPhotoSignUp'],
          customFields: {
            SOURCE: 'FilmPhotoSignUp',
          },
        },
      },
    ]
  }
}
