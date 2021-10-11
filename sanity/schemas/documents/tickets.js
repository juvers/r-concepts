import { GrTicket } from "react-icons/gr";
import {
  titleField,
  titleAndSlugField,
  imageField,
  simpleRichtextField,
  stringField,
  externalLinkField,
  hiddenSortOrderField,
} from "../fields";

const getTicketCategoryId = () => {
  const patt = /tickets;(?<ticketCategoryId>.*)?;ticketCategoryFeature;/;
  const result = window.location.href.match(patt);
  return result && result.groups && result.groups.ticketCategoryId;
};

exports.ticketCategoryFeature = {
  name: "ticketCategoryFeature",
  title: "Ticket Category Feature",
  type: "document",
  icon: GrTicket,
  fields: [
    simpleRichtextField("description"),
    {
      name: "category",
      type: "reference",
      to: [{ type: "ticketCategory" }],
      options: {
        filter: ({ document }) => {
          /*
           *  Limit the choices to the ticket category
           *  that's in the url if it exists
           */
          const ticketCategoryId = getTicketCategoryId();

          if (ticketCategoryId) {
            return {
              filter: "_id == $id",
              params: { id: ticketCategoryId },
            };
          }

          return {
            filter: "_type == 'ticketCategory'",
            params: {},
          };
        },
      },
    },
    hiddenSortOrderField(),
  ],
  preview: {
    select: {
      description: "description",
    },
    prepare(selection) {
      let { description } = selection;
      try {
        description = description[0].children[0].text;
      } catch (err) {
        description = "Untitled";
      }
      return {
        title: description,
      };
    },
  },
  initialValue: () => {
    return {
      category: {
        _type: "reference",
        _ref: getTicketCategoryId(),
      },
    };
  },
};

exports.ticketCategory = {
  name: "ticketCategory",
  title: "Ticket Category",
  type: "document",
  icon: GrTicket,
  fields: [
    titleAndSlugField(),
    {
      ...simpleRichtextField("description"),
      validation: null,
    },
    {
      name: "tickets",
      type: "array",
      of: [{ type: "ticket" }],
    },
    hiddenSortOrderField(),
  ],
  preview: {
    select: {
      title: "titleAndSlug.title",
    },
  },
  orderings: [
    {
      title: "Order by sort order",
      name: "sortOrderAsc",
      by: [
        {
          field: "order",
          direction: "asc",
        },
      ],
    },
  ],
};

exports.ticket = {
  name: "ticket",
  title: "Ticket",
  type: "document",
  icon: GrTicket,
  fields: [
    titleField(),
    imageField("image"),
    simpleRichtextField("description"),
    stringField("price"),
    externalLinkField("url"),
    {
      name: "includedFeatures",
      title: "Included Features",
      description: "What features are included in this ticket?",
      type: "array",
      of: [
        {
          type: "reference",
          to: {
            type: "ticketCategoryFeature",
          },
          options: {
            filter: ({ document, parent, parentPath }) => {
              const ticketCategoryId = document._id.replace("drafts.", "");

              if (ticketCategoryId) {
                return {
                  filter: `_type == "ticketCategoryFeature" && references("${ticketCategoryId}")`,
                  params: {},
                };
              }

              return {
                filter: "_type == 'ticketCategoryFeature'",
                params: {},
              };
            },
          },
        },
      ],
    },
  ],
};
