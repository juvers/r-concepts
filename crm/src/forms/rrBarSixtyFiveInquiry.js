module.exports = {
  name: "rrBarSixtyFiveInquiry",
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
      title: "Purpose of Inquiry",
      name: "purpose",
    },
    {
      title: "Comments",
      name: "comments",
    }
  ],
  options: {
    integrations: [
      {
        name: 'tripleseat',
        options: {
          updateFields: (fieldData, formSchemaFields) => {
            const [firstname, ...lastname] = fieldData['fullname'].split(' ');
            return {
              first_name: firstname,
              last_name: lastname.join(' ').trim(),
              email_address: fieldData['email'],
              phone_number: fieldData['phone'],
              event_description: fieldData['purpose'],
              location_id: 4146,
              location_name: 'RR/Bar SixtyFive',
              additional_information: fieldData['comments'],
            }
          }
        }
      }
    ]
  }
}

