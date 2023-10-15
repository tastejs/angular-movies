import '!style-loader!css-loader!sass-loader!../src/styles.scss';
import { applicationConfig, moduleMetadata, Parameters, Preview } from '@storybook/angular';
import { provideFastSVG } from '@push-based/ngx-fast-svg';
import { NgIf } from '@angular/common';

export const parameters: Parameters = {
  backgrounds: {
    values: [
      { name: 'blue', value: '#2b0163' },
    ]
  }
};

export const globalTypes = {
  scheme: {
    name: "Scheme",
    description: "Select light of dark mode",
    defaultValue: "both",
    toolbar: {
      icon: "mirror",
      items: ["light", "dark", "both"],
      dynamicTitle: true,
    }
  }
}

const preview: Preview = {
  decorators: [
    moduleMetadata({
      imports: [
        NgIf
      ]
    }),
    applicationConfig({
      providers: [
        provideFastSVG({
          url: (name: string) => `svg-icons/${name}.svg`,
        })
      ]
    })
  ],
};

export default preview;
