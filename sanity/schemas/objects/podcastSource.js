const podcastHost = [
  { title: "apple", value: "apple" },
  { title: "spotify", value: "spotify" },
  { title: "audible", value: "audible" },
];

const podcastSource = {
  name: "podcastSource",
  type: "object",
  fields: [
    {
      name: "host",
      type: "string",
      options: {
        list: podcastHost,
      },
    },
    {
      name: "url",
      type: "url",
    },
  ],
};

export { podcastSource };
