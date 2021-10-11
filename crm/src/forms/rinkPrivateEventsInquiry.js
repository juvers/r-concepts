module.exports = {
  name: "rinkPrivateEventsInquiry",
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
          to: [
            'jlevine@rainbowroom.com',
            'rrichardson@rainbowroom.com',
            'kegan@tishmanspeyer.com'
          ],
          from: 'no-reply@rockefellercenter.com',
          subject: 'A message from Private Events at Rockefeller Center'
        }
      }
    ]
  }
}
