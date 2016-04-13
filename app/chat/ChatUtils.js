export function getConversationName(conversation) {
  if (conversation.type === 'about_shout') {
    return `${conversation.about.title || 'Shout'} by ${conversation.about.profile.name}`;
  }
  const partecipants = conversation.profiles.filter(profile => !profile.isOwner);
  return partecipants.map(profile => profile.name).join(', ') || '(no partecipants)';
}
