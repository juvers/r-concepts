declare module 'gatsby-plugin-mailchimp' {
  const addToMailchimp: (
    email: string,
    fields?: object,
    endpointOverride?: string,
  ) => Promise<{result: string; msg: string}>;

  export default addToMailchimp;
}
