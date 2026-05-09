import { addons } from '@storybook/manager-api';
import { flexpriceTheme } from './theme';

addons.setConfig({
  theme: flexpriceTheme,
  sidebar: {
    showRoots: true,
    collapsedRoots: [],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});
