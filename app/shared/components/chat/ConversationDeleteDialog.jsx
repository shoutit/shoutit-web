import React from "react";
import Dialog from "material-ui/lib/dialog";
import FlatButton from "material-ui/lib/flat-button";

export default function ConversationDeleteDialog({ open, onRequestClose, onConfirm, isDeleting}) {

  const actions = [
    <FlatButton key="cancel" secondary label="Cancel" onTouchTap={ onRequestClose } />,
    <FlatButton key="submit" primary disabled={ isDeleting }
        label={ isDeleting ? "Deleting..." : "Delete" }
        onTouchTap={ onConfirm }
    />
  ];

  return (
    <Dialog actions={ actions }
      modal={ false }
      onRequestClose={ onRequestClose }
      title="Delete this entire conversation?"
      open={ open }>
      Once you delete your copy of this conversation, it cannot be undone.
    </Dialog>
  );

}
