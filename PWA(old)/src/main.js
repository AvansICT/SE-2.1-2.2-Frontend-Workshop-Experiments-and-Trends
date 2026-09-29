import { mount } from 'svelte';
import App from './App.svelte';
import { registerServiceWorker } from './lib/pwa.svelte.js';
import './app.css';

registerServiceWorker();

export default mount(App, { target: document.getElementById('app') });
