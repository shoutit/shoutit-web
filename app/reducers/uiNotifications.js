// import React from 'react';
// import * as actionTypes from '../actions/actionTypes';
// import UINotification from '../ui/UINotification';
//
// export default function (state = [], action) {
//   let notification;
//
//   switch (action.type) {
//     case actionTypes.DISMISS_UI_NOTIFICATION:
//       return state.filter(({ id }) => id !== action.payload);
//     case actionTypes.VIDEOCALL_SET_OUTGOING_INVITE:
//       notification = {
//         content: <UINotification>Outgoing invite</UINotification>,
//         id: 'videocall',
//       };
//       return [...state, notification];
//     case actionTypes.VIDEOCALL_ADD_INCOMING_INVITE:
//       notification = {
//         content: <UINotification>Incoming invite</UINotification>,
//         id: 'videocall',
//       };
//       return [...state, notification];
//   }
//
//   return state;
// }
