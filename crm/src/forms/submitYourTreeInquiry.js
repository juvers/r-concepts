module.exports = {
  name: "submitYourTreeInquiry",
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
      title: "Address",
      name: "address",
    },
    {
      title: "City",
      name: "city",
    },
    {
      title: "State",
      name: "state",
    },
    {
      title: "Zip",
      name: "zip",
    },
    {
      title: "Approximate Tree Height",
      name: "treeheight",
    },
    {
      title: "Upload A Photo",
      name: "image",
      type: 'attachment',
    },
    {
      title: "Comments",
      name: "comments",
    },
  ],
  options: {
    integrations: [
      {
        name: 'sendgrid',
        options: {
          to: ['epauze@tishmanspeyer.com', 'elaineh@hzdg.com'],
          from: 'no-reply@rockefellercenter.com',
          subject: 'Tree Submission Inquiry'
        }
      },
    ]
  }
}
