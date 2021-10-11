module.exports = {
  name: "theRocklistNewsletter",
  fields: [
    {
      title: "Email",
      name: 'email',
      required: true,
    },
    {
      title: "Do you live or work in New York City?",
      name: "localtonyc",
      tags: {yes: 'local', no: 'general'}
    },
    {
      title: "Food & Drink",
      name: "foodDrink",
      interestId: 'cd720d277f',
    },
    {
      title: "The Rink at Rockefeller Center",
      name: "rinkAtRc",
      interestId: '12c79f1c16',
    },
    {
      title: "Rainbow Room & Bar SixtyFive",
      name: "rrBarSixtyFive",
      interestId: '6748d8b85b',
    },
    {
      title: "Shopping",
      name: "shopping",
      interestId: '6bcacea83f',
    },
    {
      title: "Family Entertainment",
      name: "familyEntertainment",
      interestId: 'b1a2c4f778',
    },
    {
      title: "Private Events & Weddings",
      name: "privateEventsWeddings",
      interestId: 'a99f72e12c',
    },
    {
      title: "Rockefeller Center Events & Experiences",
      name: "rcEventsExperiences",
      interestId: '5e77ad6b08',
    },
    {
      title: "Arts, Music & Culture",
      name: "artMusicCulture",
      interestId: '09bb6e55bd',
    },
    {
      title: "Rockefeller Center Stories",
      name: "rcStories",
      interestId: '221d19c273',
    },



  ],
  options: {
    integrations: [
      {
        name: 'mailchimp',
        options: {
          tags: ['Source:THECENTER'],
          customFields: {
            SOURCE: 'ROCKLIST',
          },
          updateFields: (fieldData, formFields) => {
            try {
              let newData = fieldData;
              let customTags = [];
              let customInterests = {}
              // convert checkbox and radio fields into tags
              for (const fieldObj of formFields) {
                const fieldValue = fieldData[fieldObj.name];
                if (fieldValue !== null && fieldValue !== undefined) {
                  if (fieldValue === 'true' || fieldValue === true) {
                    if (fieldObj.interestId) {
                      customInterests[fieldObj.interestId] = true;
                      delete newData[fieldObj.name];
                    }
                    if (fieldObj.tags) {
                      customTags = customTags.concat(fieldObj.tags.yes);
                      delete newData[fieldObj.name];
                    }
                  } else if (fieldValue === 'false' || fieldValue === false) {
                    if (fieldObj.tag) {
                      // Do nothing, we dont want a tag
                    }
                    if (fieldObj.tags) {
                      customTags = customTags.concat(fieldObj.tags.no);
                      delete newData[fieldObj.name];
                    }
                    delete newData[fieldObj.name];
                  } else {
                    // FieldValue is invalid, do nothing
                  }
                } else {
                  // The data submitted does not have this field mentioned at all. Ignore?
                }
              }
              return {
                ...fieldData,
                customTags,
                customInterests
              }
            } catch (error) {
              return {error};
            }
          }
        },
      },
    ],
  }
}
