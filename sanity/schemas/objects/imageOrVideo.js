export const imageOrVideoType = {
  name: "imageOrVideoType",
  title: "Image / Video",
  type: "object",
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    {
      name: "image",
      title: "Image",
      type: "imageType",
    },
    {
      name: "video",
      type: "ambientVideoType",
      title: "Video",
    },
  ],
  validation: (Rule) =>
    Rule.custom((fields) => {
      if (!fields) {
        return "Please specify an image or video";
      }

      const { image, video } = fields;

      if (image && !image.asset && video && !video.videoFile) {
        return "Please add an image or video";
      }

      if (image && image.asset && video && video.videoFile) {
        return "Please add an image or video, but not both";
      }

      return true;
    }),
};
