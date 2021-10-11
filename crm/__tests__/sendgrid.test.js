import sendgrid from '../integrations/sendgrid';

const exampleForm = {
  name: "testFilmInquiry",
  fields: [
    {
      title: "Full Name",
      name: "name",
      type: "string"
    }
  ],
  options: {
    integrations: [
      {
        name: 'sendgrid',
        options: {
          to: ['elainenh7@gmail.com'],
          from: 'elaineh@hzdg.com',
          subject: 'A new form submission filmPhotoInquirySection',
        }
      }
    ],
  }
};

test('Test sendgrid send', () => {
  return sendgrid({
    formData: {
      name: 'Jane Doe',
    },
    options: exampleForm.options.integrations[0].options,
    formName: exampleForm.name,
    formFields: exampleForm.fields,
  }).then((data) => {
    console.log(data);
    expect(data.status).toBe(200);
  })
});