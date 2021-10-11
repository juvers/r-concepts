export default {
  widgets: [
    {
      name: "document-list",
      layout: {
        width: "small",
        height: "small",
      },
      options: { types: ["event", "business"] },
    },
    {
      name: "document-list",
      options: {
        title: "Last edited",
        order: "_updatedAt desc",
        types: ["event", "business"],
      },
    },
    { name: "project-info" },
    { name: "project-users" },
    {
      name: "netlify",
      options: {
        title: "My Netlify deploys",
        sites: [
          {
            title: "RC Master",
            apiId: "1e1f0f35-7003-40ee-8dce-3f3ecd6178fe",
            buildHookId: "5fa30749b872a225116e6038",
            name: "RC Master",
          },
        ],
      },
    },
  ],
};
