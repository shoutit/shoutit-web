import moment from "moment";
import groupBy from "lodash/collection/groupBy";
import reduce from "lodash/collection/reduce";
import last from "lodash/array/last";

export function groupByDay(messages) {
  const groupedByDay = groupBy(messages, message =>  moment.unix(message.createdAt).format("YYYY-MM-DD"));
  const asArray = reduce(groupedByDay, (result, messages, day) => {
    result.push({ day, messages });
    return result;
  }, []);
  return asArray.sort((a, b) => moment(a.day) > moment(b.day));
}

export function groupByUser(messages) {
  const groupedByUser = messages.reduce((result, message) => {
    const lastResult = last(result);

    const shouldAddNewGroup = (
      result.length === 0 ||
      !lastResult.user && message.user ||
      lastResult.user && !message.user ||
      lastResult.user.id !== message.user.id
    );

    if (shouldAddNewGroup) {
      const messageByUser = { user: message.user, messages: [message] };
      result.push(messageByUser);
    } else {
      last(result).messages.push(message);
    }
    return result;
  }, []);

  return groupedByUser;
}

export function getReadyBy(message, users, excludeUsername) {
  if (!message.read_by) {
    return [];
  }

  // Map each profile_id to users
  let readBy = users.filter(user =>
    message.read_by.some(reader => reader.profile_id === user.id)
  );

  // exclude message's author
  readBy = readBy.filter(user => user.id !== message.user.id);

  if (excludeUsername) {

    readBy = readBy.filter(user => user.username !== excludeUsername);
  }
  return readBy;
}
