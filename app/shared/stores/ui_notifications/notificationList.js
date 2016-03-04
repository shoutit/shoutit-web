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
import UserAvatar from "../../components/user/UserAvatar.jsx";

import Notification from "../../components/notifications/Notification.jsx";
import VideoCallLocalMedia from "../../components/videoCalls/VideoCallLocalMedia";

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

export function VIDEOCALL_PREVIEW({ user }, dismiss, flux) {
  const options = { autoHide: false, notificationId: "videocall" };
  const buttons = [
    <Button
      size="small"
      label="Cancel"
      onClick={ () => dismiss(options.notificationId) } />,
    <Button
      primary
      size="small"
      label="Call"
      onClick={ () => flux.actions.inviteToVideoCall(user) } />
  ];

  const content = (
    <Notification showDismissButton={ false } icon= {  <UserAvatar user={ user } />  } buttons={buttons}>
      Call <strong>{ user.name }</strong>?
      <div style={{ marginTop: 10 }}>
        <VideoCallLocalMedia />
      </div>
    </Notification>
  );

  return { options, content };
}

export function VIDEOCALL_OUTGOING({ user, outgoingInvite }) {
  const options = { autoHide: false, notificationId: "videocall" };
  const buttons = [
    <Button
      size="small"
      label="Cancel"
      onClick={ () => outgoingInvite.cancel() } />
  ];

  const content = (
    <Notification showDismissButton={ false } icon= { <SVGIcon name="video" active /> } buttons={buttons}>
      Calling <strong>{ user.name }</strong>…
    </Notification>
  );

  return { options, content };
}

export function VIDEOCALL_OUTGOING_ACCEPTED(payload, dismiss) {
  dismiss("videocall");
}

export function VIDEOCALL_OUTGOING_CANCELED(payload, dismiss) {
  dismiss("videocall");
}

export function VIDEOCALL_OUTGOING_REJECTED({ user }, dismiss) {
  const options = { autoHide: false, notificationId: "videocall" };
  const content = (
    <Notification
      icon= { <SVGIcon name="video" active /> }
      buttons={ [<Button size="small" primary label="Close" onClick={ () => dismiss(options.notificationId) } />] }>
      <p>Cannot call { user.name }</p>
      <p><small>{ user.name } rejected the call.</small></p>
    </Notification>
  );
  return { options, content };
}

export function VIDEOCALL_OUTGOING_FAILURE({ user, error }, dismiss, flux) {
  const options = { autoHide: false, notificationId: "videocall" };
  const buttons = [
    <Button key="close" size="small" label="Close" onClick={ () => dismiss(options.notificationId) } />,
    <Button key="retry" primary autoFocus size="small" label="Retry" onClick={ () => {
      dismiss(options.notificationId);
      flux.actions.inviteToVideoCall(user);
    }} />
  ];
  const content = (
    <Notification showDismissButton={ false } icon= { <SVGIcon name="video" active /> } buttons={buttons}>
        <p>Cannot call { user.name }</p>
      <div><small>{ user.name } is offline or can't answer the call.</small></div>
    </Notification>
  );
  return { options, content };
}

export function VIDEOCALL_INCOMING({ incomingInvite, user }, dismiss, flux) {
  const options = { autoHide: false, notificationId: incomingInvite.conversationSid };
  const buttons = [
    <Button key="reject" size="small" label="Reject" onClick={ () => incomingInvite.reject() } />,
    <Button key="accept" size="small" primary label="Accept" onClick={ () => flux.actions.acceptVideoCall(incomingInvite) } />
  ];

  const content = (
    <Notification showDismissButton={ false } icon= { <UserAvatar user={ user } />  } buttons={buttons}>
      <strong>{ user.name }</strong> is calling you…
    </Notification>
  );

  return { options, content };
}

export function VIDEOCALL_INCOMING_ACCEPTED({ incomingInvite }, dismiss) {
  dismiss(incomingInvite.conversationSid);
}

export function VIDEOCALL_INCOMING_REJECTED({ incomingInvite }, dismiss) {
  dismiss(incomingInvite.conversationSid);
}

export function VIDEOCALL_INCOMING_CANCELED({ incomingInvite, user, error }, dismiss) {
  const notificationId = incomingInvite.conversationSid;
  const options = { autoHide: false, notificationId };
  const buttons = [
    <Button size="small" primary label="Close" onClick={ () => dismiss(notificationId) } />
  ];
  const content = (
    <Notification icon= { <SVGIcon name="video" active /> } buttons={ buttons }>
      <p>{ user.name } canceled this call.</p>
    </Notification>
  );
  return { options, content };
}

export function VIDEOCALL_INCOMING_FAILURE({ incomingInvite, error }, dismiss) {
  const notificationId =  incomingInvite.conversationSid;
  const options = { autoHide: false, notificationId };
  const buttons = [
    <Button size="small" primary label="Close" onClick={ () => dismiss(notificationId) } />
  ];
  const content = (
    <Notification icon= { <SVGIcon name="video" active /> } buttons={ buttons }>
      <p>Cannot start the call because of an error.</p>
      <div><small>{ error.message }</small></div>
    </Notification>
  );
  return { options, content };
}
