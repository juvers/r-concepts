module.exports = {
  name: "groupSalesyInquiry",
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
      title: "Date",
      name: "date",
    },
    {
      title: "Time",
      name: "time",
    },
    {
      title: "Attraction",
      name: "attraction",
    },
    {
      title: "Number of People",
      name: "guestcount",
    },
  ],
  options: {
    integrations: [
      {
        name: "sendgrid",
        options: {
          to: ["groups@topoftherocknyc.com"],
          from: "no-reply@rockefellercenter.com",
          subject: "Group Sales Inquiry",
        },
      },
    ],
  },
};
