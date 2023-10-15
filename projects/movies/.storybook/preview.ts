import '!style-loader!css-loader!sass-loader!../src/styles.scss';
import { applicationConfig, componentWrapperDecorator, Decorator, Preview } from '@storybook/angular';
import { provideFastSVG } from '@push-based/ngx-fast-svg';

export const parameters = {
  layout: 'full-screen',
  backgrounds: {
    values: [
      { name: 'blue', value: '#2b0163' },
    ]
  }
};

function withBothColorScheme(): Decorator {
  return componentWrapperDecorator(
    (story) => {
      return `
      <body class='light' style='padding: 10px; max-width: 100%;'>${story}</body>
      <body class='dark' style='padding: 10px; max-width: 100%'>${story}</body>
    `;
    },
    (context) => {
      return { colorScheme: context.globals['scheme']};
    }
  );
}

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [
        provideFastSVG({
          url: (name: string) => `svg-icons/${name}.svg`,
        })
      ]
    }),
    withBothColorScheme()
  ],
};

export default preview;
