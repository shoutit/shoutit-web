/* eslint-env browser */
import { jsdom } from 'jsdom';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import 'ignore-styles';

chai.use(sinonChai);

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
