import {
  MdBusiness,
  MdLocationCity,
  MdImage,
  MdArchive,
  MdQuestionAnswer,
  MdInsertDriveFile,
  MdMic,
  MdPerson,
  MdFilterNone,
  MdLocalOffer,
  MdPublic,
  MdPalette,
  MdEventAvailable,
} from "react-icons/md";
import { GrTicket, GrMapLocation } from "react-icons/gr";
import { businessCategory } from "../schemas/documents/business";
import {
  attractionPages,
  attractionEventVenuePages,
} from "../schemas/documentTypes";
import S, { listItem } from "@sanity/desk-tool/structure-builder";
import { rockListLP } from "../schemas/documents/rockListLP";

const hiddenDocTypes = (listItem) =>
  ![
    "siteSettings",
    "business",
    "generalFaqs",
    "businessDirectoryPage",
    "eventLP",
    "event",
    "event.treeLighting",
    "event.virtual",
    "communityLP",
    "artAuthor",
    "cultureLP",
    "artLP",
    "art",
    "storyLP",
    "story",
    "offer",
    "offerLP",
    "podcast",
    "podcastLP",
    "rockListLP",
    "newsPress",
    "ticket",
    "ticketCategory",
    "ticketCategoryFeature",
    "gessoAudioTour",
    "directions",
    ...attractionPages.map((item) => item.type),
    ...attractionEventVenuePages.map((item) => item.type),
  ].includes(listItem.getId());

const businessByCategory = () =>
  Object.keys(businessCategory).map((category) => [
    listItem()
      .title(category)
      .icon(businessCategory[category].icon)
      .child(
        S.documentList()
          .title(category)
          .menuItems(S.documentTypeList("business").getMenuItems())
          .filter("_type == $type && category.category==$category")
          .params({ type: "business", category: category })
          .initialValueTemplates([
            S.initialValueTemplateItem(`business-${category}`, { category }),
          ])
      ),
    listItem()
      .icon(businessCategory[category].icon)
      .title(`${category}DirectoryPage`)
      .icon(businessCategory[category].icon)
      .child(
        S.editor()
          .schemaType("businessDirectoryPage")
          .documentId(`${category}DirectoryPage`)
      ),
  ]);

export default () =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .child(
          S.editor().schemaType("siteSettings").documentId("siteSettings")
        ),
      S.divider(),
      S.documentTypeListItem("sanity.imageAsset").title("Images").icon(MdImage),
      S.divider(),
      S.documentTypeListItem("sanity.fileAsset").title("Files").icon(MdArchive),
      S.divider(),
      S.listItem()
        .title("Attractions")
        .icon(MdLocationCity)
        .child(
          S.list()
            .title("Attractions")
            .items([
              ...attractionPages.map((item) => {
                if (item.type == "attraction.event") {
                  return S.listItem()
                    .title(item.name)
                    .icon(MdLocationCity)
                    .child(
                      S.list()
                        .title("Private Event")
                        .items([
                          S.documentListItem()
                            .schemaType(item.type)
                            .title(item.name),
                          S.listItem()
                            .title("Private event venues")
                            .child(
                              S.list()
                                .title("Private event venues")
                                .items([
                                  ...attractionEventVenuePages.map((citem) =>
                                    S.documentListItem()
                                      .schemaType(citem.type)
                                      .title(citem.name)
                                  ),
                                ])
                            ),
                        ])
                    );
                } else {
                  return S.documentListItem()
                    .schemaType(item.type)
                    .title(item.name);
                }
              }),
            ])
        ),

      S.listItem()
        .title("Business by Type")
        .id("business-by-category")
        .icon(MdBusiness)
        .child(
          S.list()
            .title("Business")
            .items([...businessByCategory().flat()])
        ),
      S.documentListItem()
        .id("general-faqs")
        .title("General Faqs")
        .icon(MdQuestionAnswer)
        .schemaType("generalFaqs"),
      S.divider(),
      S.documentListItem().id("communityLP").schemaType("communityLP"),
      S.documentListItem().id("eventLP").schemaType("eventLP"),
      S.listItem()
        .title("Events")
        .icon(MdEventAvailable)
        .child(S.documentTypeList("event")),
      S.listItem()
        .title("Events Virtual")
        .child(S.documentTypeList("event.virtual")),
      S.listItem()
        .title("Events Tree Lighting")
        .child(S.documentTypeList("event.treeLighting")),
      S.divider(),

      S.documentListItem().id("cultureLP").schemaType("cultureLP"),
      S.documentListItem().id("storyLP").schemaType("storyLP"),
      S.listItem()
        .title("Stories")
        .icon(MdFilterNone)
        .child(S.documentTypeList("story")),
      S.documentListItem().id("offerLP").schemaType("offerLP"),
      S.listItem()
        .title("Offers")
        .icon(MdLocalOffer)
        .child(S.documentTypeList("offer")),
      S.documentListItem().id("artLP").schemaType("artLP"),
      S.listItem()
        .title("Arts")
        .icon(MdPalette)
        .child(S.documentTypeList("art")),
      S.listItem()
        .title("Art Authors")
        .icon(MdPerson)
        .child(S.documentTypeList("artAuthor")),
      S.listItem()
        .title("News & Updates")
        .icon(MdPublic)
        .child(S.documentTypeList("newsPress")),
      S.documentListItem().title('Newsstand Studios LP').id("newsstandStudiosLP").schemaType("podcastLP"),
      S.listItem()
        .title("Newsstand Studios")
        .icon(MdMic)
        .child(S.documentTypeList("podcast")),
      S.documentListItem()
        .id("rockListLP")
        .title("Rock List Newsletter Signup Page")
        .icon(MdInsertDriveFile)
        .schemaType("rockListLP"),
      S.documentListItem()
        .id("gessoAudioTour")
        .title("gessoAudioTour Page")
        .icon(MdInsertDriveFile)
        .schemaType("gessoAudioTour"),
      S.divider(),

      S.documentListItem()
        .id("directions")
        .icon(GrMapLocation)
        .title("Directions")
        .schemaType("directions"),

      S.listItem()
        .id("tickets")
        .icon(GrTicket)
        .title("Tickets")
        .child(
          S.documentTypeList("ticketCategory")
            .title("Ticket Categories")
            .child(
              async (categoryId, { parent, index, parentPath, splitIndex }) => {
                /*
                 *  There doesn't seem to be a good way to detect if
                 *  we're trying to create a new ticket category, so
                 *  look for the word "template" in the url, and
                 *  use that to determine if we should return the document node
                 *  in order to create a new category.
                 */
                if (window.location.pathname.includes("template")) {
                  return S.document().documentId(categoryId);
                }
                return S.list()
                  .title("Category")
                  .items([
                    S.documentTypeListItem("ticketCategory")
                      .title("Details & Ticket Types")
                      .child(S.document().id(categoryId)),
                    S.documentTypeListItem("ticketCategoryFeature")
                      .title("Category Features")
                      .child(async (id, childParams) => {
                        return S.documentTypeList(
                          "ticketCategoryFeature"
                        ).filter(
                          `_type == "ticketCategoryFeature" && references("${categoryId}")`
                        );
                      }),
                  ]);
              }
            )
        ),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ]);
