export function getConversationName(conversation) {
  let name = '';
  if (conversation.type === 'about_shout') {
    const shout = conversation.about;
    name += shout.title || 'Shout';
    if (shout.profile) {
      name += ` by ${conversation.about.profile.name}`;
    }
  } else {
    const profiles = conversation.profiles.filter(profile => !profile.isOwner);
    name = profiles.map(profile => profile.name).join(', ') || '(nobody)';
  }
  return name;
}
