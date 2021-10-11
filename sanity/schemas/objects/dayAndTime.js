import Icon from "../components/icon";
import TimeInput from "../components/timeInput";
import React from "react";
import format from "date-fns/format";
import parse from "date-fns/parse";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const daysMedia = {
  Monday: "🄼",
  Tuesday: "🅃",
  Wednesday: "🅆",
  Thursday: "🅃",
  Friday: "🄵",
  Saturday: "🆂",
  Sunday: "🆂",
};
const varifyInput = (dayAndTime) => {
  const { day, opensAt, closesAt } = dayAndTime;
  if (!day) {
    return "Please select a day";
  }
  if (!opensAt) {
    return "Choose when the store opens";
  }
  if (!closesAt) {
    return "Choose when the store closes";
  }
  return opensAt < closesAt
    ? true
    : `Let's open the store before we close it on ${day}, shall we ? `;
};

export default {
  name: "dayAndTime",
  title: "Day and Time",
  type: "object",
  validation: (Rule) => Rule.custom(varifyInput),
  fields: [
    {
      name: "day",
      title: "day",
      type: "string",
      description: "Select day of week",
      options: {
        list: days,
        layout: "radio",
      },
    },
    {
      name: "opensAt",
      title: "OpensAt",
      type: "string",
      description: "Choose when the store opens",
      inputComponent: TimeInput,
    },
    {
      name: "closesAt",
      title: "ClosesAt",
      type: "string",
      description: "Choose when the store closes",
      inputComponent: TimeInput,
    },
  ],
  preview: {
    select: {
      day: "day",
      opensAt: "opensAt",
      closesAt: "closesAt",
    },
    prepare({ day, opensAt, closesAt }) {
      let _closesAt = closesAt.split(":");
      const appm = _closesAt[0] < 12 ? "AM" : "PM";
      _closesAt[0] = parseInt(closesAt) % 12 || 12;
      _closesAt = _closesAt.join(":") + " " + appm;

      return {
        media: () => <Icon emoji={daysMedia[day]} />,
        title: day,
        subtitle: `${opensAt} - ${_closesAt}`,
      };
    },
  },
};
