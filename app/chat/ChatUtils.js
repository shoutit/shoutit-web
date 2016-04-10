export function getConversationName(conversation, loggedUser) {
  const partecipants = conversation.profiles.filter(profile => profile.id !== loggedUser.id);
  return partecipants.map(profile => profile.name).join(', ') || '(no partecipants)';
}
