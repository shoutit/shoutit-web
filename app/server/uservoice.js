import { USERVOICE_API_KEY } from '../config';

export default `
UserVoice=window.UserVoice||[];
(function(){
  var uv=document.createElement('script');
  uv.type='text/javascript';
  uv.async=true;
  uv.src='//widget.uservoice.com/${USERVOICE_API_KEY}.js';
  var s=document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(uv,s)
})();
UserVoice.push(['addTrigger', {}]);
UserVoice.push(["set", "locale", "{locale}"]);
`;
