module.exports = {
  name: "privateEventsInquiry",
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
      title: "Company or Private Event",
      name: "eventcategory",
    },
    {
      title: "Event Venue",
      name: "venue",
      options: [
        {
          id: 4146,
          name: 'Rainbow Room',
        },
        {
          id: 4310,
          name: '620 Loft & Garden',
        },
        {
          id: 4146,
          name: 'Private Dining Room',
        },
        {
          id: 4146,
          name: 'Bar SixtyFive',
        },
      ]
    },
    {
      title: "Event Type",
      name: "eventtype",
    },
    {
      title: "Number of Guests",
      name: "guestcount",
    },
    {
      title: "Date of Event",
      name: "eventdate",
    },
    {
      title: "Additional Information",
      name: "eventdescription",
    }
  ],
  options: {
    integrations: [
      {
        name: 'sendgrid',
        options: {
          to: ['events@rockefellercenter.com'],
          from: 'no-reply@rockefellercenter.com',
          subject: 'A message from Private Events at Rockefeller Center',
        }
      },
      {
        name: 'tripleseat',
        options: {
          updateFields: (fieldData, formSchemaFields) => {
            const [firstname, ...lastname] = fieldData['fullname'].split(' ');
            const eventVenueSchema = formSchemaFields.find(item => item.name === 'venue');
            const {id, name} = eventVenueSchema.options.find(option => option.name === fieldData['venue'])
            return {
              first_name: firstname,
              last_name: lastname.join(' ').trim(),
              email_address: fieldData['email'],
              phone_number: fieldData['phone'],
              event_description: `${fieldData['eventcategory']} - ${fieldData['eventtype']}`,
              location_id: id,
              location_name: name,
              guest_count: fieldData['guestcount'],
              event_date: fieldData['eventdate'],
              additional_information: fieldData['eventdescription'],
            }
          }
        }
      }
    ]
  }
}

