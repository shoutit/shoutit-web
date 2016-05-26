import moment from 'moment';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import last from 'lodash/last';

export function groupByDay(messages) {
  const groupedByDay = groupBy(messages, message => moment.unix(message.createdAt).format('YYYY-MM-DD'));
  const asArray = reduce(groupedByDay, (result, messages, day) => {
    result.push({ day, messages });
    return result;
  }, []);
  return asArray.sort((a, b) => moment(a.day) > moment(b.day));
}

export function groupByProfile(messages) {
  const groupedByProfile = messages.reduce((result, message) => {
    const lastResult = last(result);

    const shouldAddNewGroup = (
      (result.length === 0) ||
      (!lastResult.profile && message.profile) ||
      (lastResult.profile && !message.profile) ||
      (lastResult.profile && lastResult.profile.id !== message.profile.id)
    );

    if (shouldAddNewGroup) {
      const messageByProfile = { profile: message.profile, messages: [message] };
      result.push(messageByProfile);
    } else {
      last(result).messages.push(message);
    }
    return result;
  }, []);

  return groupedByProfile;
}

export function getReadyBy(message, profiles) {
  if (!message.readBy) {
    return [];
  }

  // Map each profile_id to profiles
  let readBy = profiles.filter(profile =>
    !profile.isOwner && message.readBy.some(reader => reader.profileId === profile.id)
  );

  // exclude message's author
  readBy = readBy.filter(profile => profile.id !== message.profile.id);

  return readBy;
}
