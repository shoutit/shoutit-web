/*

To add a notification when a flux action is dispatched, export a function named
after the action type name.

This function can return:

* a string as notification message
* a <Notification /> element to display into the notification
* an object with `content` and `options`:
    - `content` can be a string or a <Notification /> element
    - `options` are options for the notification.

Function signature

  function(actionPayload, dismiss, flux)

Options(Object):

  autoHide (Boolean) If true, the notification will hide after 4 seconds
  notificationId (String|Number) An id to reuse a previous displayed notification

*/

import React from "react";
import SVGIcon from "../../components/helper/SVGIcon";
import Button from "../../components/helper/Button.jsx";

import Notification from "../../components/notifications/Notification.jsx";

export function LISTEN_SUCCESS(user) {
  return (
    <Notification icon= { <SVGIcon name="listen" active /> }>
      You are now listening to <strong>{user.username}</strong>’s activity.
    </Notification>
  );
}

export function STOP_LISTEN_SUCCESS(user) {
  return (
    <Notification icon= { <SVGIcon name="listen" on /> }>
      You are no longer listening to <strong>{user.username}</strong>’s activity.
    </Notification>
  );
}

export function LISTEN_TAG_SUCCESS({ tagName}) {
  return `You are now listening to the tag ${tagName}.`;
}

export function STOP_LISTEN_TAG_SUCCESS({ tagName}) {
  return `You are no longer listening listening to the tag ${tagName}.`;
}

export function VIDEOCALL_OUTGOING({ user, videoCallId }, dismiss) {
  const options = { autoHide: false, notificationId: videoCallId };
  const buttons = [
    <Button
      size="small"
      label="Cancel"
      onClick={ () => dismiss(options.notificationId) } />
  ];

  const content = (
    <Notification showDismissButton={ false } icon= { <SVGIcon name="video" active /> } buttons={buttons}>
      Starting video call with <strong>{ user.name }</strong>…
    </Notification>
  );

  return { options, content };
}

export function VIDEOCALL_OUTGOING_SUCCESS({ videoCallId }, dismiss) {
  dismiss(videoCallId);
}

export function VIDEOCALL_OUTGOING_FAILURE({ user, error, videoCallId }, dismiss, flux) {
  const options = { autoHide: false, notificationId: videoCallId };
  const buttons = [
    <Button key="close" size="small" label="Close" onClick={ () => dismiss(options.notificationId) } />,
    <Button key="retry" primary autoFocus size="small" label="Retry" onClick={ () => {
      dismiss(options.notificationId);
      flux.actions.inviteToVideoCall(user);
    }} />
  ];

  const content = (
    <Notification showDismissButton={ false } icon= { <SVGIcon name="video" active /> } buttons={buttons}>
      <p>Cannot start video call with <strong>{ user.name }</strong>.</p>
      <div><small>{ error.message }</small></div>
    </Notification>
  );

  return { options, content };
}

export function VIDEOCALL_INCOMING(incomingInvite, dismiss, flux) {
  const options = { autoHide: false, notificationId: incomingInvite.conversationSid };
  const { rejectVideoCall, acceptVideoCall } = flux.actions;
  const buttons = [
    <Button key="reject" size="small" label="Reject" onClick={ () => rejectVideoCall(incomingInvite) } />,
    <Button key="accept" size="small" primary label="Accept" onClick={ () => acceptVideoCall(incomingInvite) } />
  ];

  const content = (
    <Notification showDismissButton={ false } icon= { <SVGIcon name="video" active /> } buttons={buttons}>
      Someone wants to call you!
    </Notification>
  );

  return { options, content };
}

export function VIDEOCALL_INCOMING_ACCEPTED({incomingInvite}, dismiss) {
  dismiss(incomingInvite.conversationSid);
}

export function VIDEOCALL_INCOMING_REJECTED({incomingInvite}, dismiss) {
  dismiss(incomingInvite.conversationSid);
}

export function VIDEOCALL_INCOMING_FAILURE({incomingInvite, error}, dismiss) {
  const notificationId =  incomingInvite.conversationSid;
  const options = { autoHide: false, notificationId };
  const buttons = [
    <Button size="small" primary label="Close" onClick={ () => dismiss(incomingInvite.conversationSid) } />
  ];
  const content = (
    <Notification icon= { <SVGIcon name="video" active /> } buttons={ buttons }>
      <p>Cannot join this video call for an error.</p>
      <div><small>{ error.message }</small></div>
    </Notification>
  );
  return { options, content };
}
