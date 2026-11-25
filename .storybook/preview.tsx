import * as React from 'react';
import type { Preview } from '@storybook/react';
import '../src/styles/index.css';
import { ThemeProvider } from '../src/hooks/use-theme';
import { DensityProvider } from '../src/hooks/use-density';
import type { DensityMode } from '../src/tokens/spacing';
import { ToastProvider } from '../src/components/ui/toast';

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Wendoro UI theme mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light Mode' },
          { value: 'dark', title: 'Dark Mode' },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      name: 'Density',
      description: 'Wendoro UI spatial density mode',
      defaultValue: 'comfortable',
      toolbar: {
        icon: 'component',
        items: [
          { value: 'compact', title: 'Compact Density' },
          { value: 'comfortable', title: 'Comfortable Density' },
          { value: 'spacious', title: 'Spacious Density' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
  },
  decorators: [
    (Story, context) => {
      const selectedTheme = (context.globals.theme as 'light' | 'dark') || 'light';
      const selectedDensity = (context.globals.density as DensityMode) || 'comfortable';

      return (
        <ThemeProvider forcedTheme={selectedTheme} disableStorage>
          <DensityProvider defaultDensity={selectedDensity} scoped>
            <ToastProvider>
              <div className="bg-background text-foreground p-4">
                <Story />
              </div>
            </ToastProvider>
          </DensityProvider>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
