import * as React from 'react';
import type { Preview } from '@storybook/react';
import '../src/styles/index.css';
import { ThemeProvider } from '../src/hooks/use-theme';
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

      React.useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(selectedTheme);
        root.setAttribute('data-theme', selectedTheme);
      }, [selectedTheme]);

      return (
        <ThemeProvider defaultTheme={selectedTheme}>
          <ToastProvider>
            <div className="bg-background text-foreground p-4">
              <Story />
            </div>
          </ToastProvider>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
