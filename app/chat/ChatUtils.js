export function getConversationName(conversation) {
  let name = '';
  const profiles = conversation.profiles.filter(profile => !profile.isOwner);
  const profileNames = profiles.map(profile => profile.name).join(', ') || '(nobody)';
  if (conversation.type === 'about_shout') {
    const shout = conversation.about;
    name += shout.title || 'Shout';
    if (shout.profile) {
      name += ` – ${conversation.about.profile.name}`;
    } else {
      name += ` – ${profileNames}`;
    }
  } else {
    name = profileNames;
  }
  return name;
}
