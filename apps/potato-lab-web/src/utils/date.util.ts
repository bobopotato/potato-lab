import moment from "moment-timezone";

export const formatDateTime = (
  date?: Date | string | null,
  format = "YYYY-MM-DD HH:mm:ss"
) => {
  if (!date) {
    return null;
  }
  return moment(date).format(format);
};
