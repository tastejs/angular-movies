import { componentWrapperDecorator, Decorator } from '@storybook/angular';

export function withBothColorScheme(): Decorator {

  return componentWrapperDecorator(
    (story) => (`
      <body
        class='light'
        *ngIf='colorScheme !== "dark"'
        style='padding: 10px; max-width: 100%;'
      >
        ${story}
      </body>
      <body
        class='dark'
        *ngIf='colorScheme !== "light"'
        style='padding: 10px; max-width: 100%'
      >
        ${story}
      </body>
    `),
    (context) => (
      { colorScheme: context.globals['scheme']}
    ),
  );
}
