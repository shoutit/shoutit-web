import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';

export default function ConversationDeleteDialog({ open, onRequestClose, onConfirm, isDeleting }) {

  const actions = [
    <FlatButton key="cancel" secondary label="Cancel" onTouchTap={ onRequestClose } />,
    <FlatButton key="submit" primary disabled={ isDeleting }
      label={ isDeleting ? 'Leaving...' : 'Leave' }
      onTouchTap={ onConfirm }
    />,
  ];

  return (
    <Dialog actions={ actions }
      modal={ false }
      onRequestClose={ onRequestClose }
      title="Leave this conversation?"
      open={ open }>
      When you leave this conversation, you won't see it anymore.
    </Dialog>
  );

}
