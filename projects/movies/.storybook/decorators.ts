import { componentWrapperDecorator, Decorator } from '@storybook/angular';

export const withBothColorScheme: Decorator = componentWrapperDecorator(
  (story) => `
      <body lang='en' class='light' *ngIf='mode === "light" || mode === "both"'>${story}</body>
      <body lang='en' class='dark' *ngIf='mode === "dark" || mode === "both"'>${story}</body>
    `,
  (context) => ({ mode: context.globals['scheme'] })
);

export const wrappedInPaddedDiv: Decorator = componentWrapperDecorator(
  (story) => `<div style='padding: 10px; max-width: 100%;'>${story}</div>`
);

export const wrappedInBody: Decorator = componentWrapperDecorator(
  (story) => `<body lang='en' [class]='mode'>${story}</body>`,
  (context) => ({ mode: context.globals['scheme'] })
);
