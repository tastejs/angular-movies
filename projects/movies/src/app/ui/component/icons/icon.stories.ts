import { componentWrapperDecorator, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { SUPPORTED_ICONS } from './icon-data';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';
import { NgFor } from '@angular/common';

const meta: Meta = {
  title: 'Component/Icon',
  component: FastSvgComponent,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: SUPPORTED_ICONS,
      defaultValue: 'sad',
      description: 'Name of the icon from the list of supported icons'
    },
    size: {
      control: 'number',
      defaultValue: '12',
      description: 'Size of the box dimensions of the Icon in pixels'
    }
  }
};

export default meta;

type Story = StoryObj<FastSvgComponent>;

export const Suspense: Story = { args: { name: 'sad', size: '24' } };


export const SupportedIcons: Story = {
  decorators: [
    moduleMetadata({
      imports: [NgFor]
    }),
    componentWrapperDecorator(() => (`
      <div style='display: flex; max-width: 100%; flex-wrap: wrap;'>
        <div
          style='
            display: flex;
            flex-direction: column;
            margin: 20px;
            flex-wrap: wrap;
            max-width: 100%;
          '
          *ngFor="let icon of [
            'account', 'back', 'genre', 'imdb', 'play', 'popular', 'search',
            'top_rated', 'upcoming', 'website', 'delete', 'sad', 'error'
          ]"
        >
          <span style='font-size: medium; font-weight: bold'>{{icon}}</span>
          <fast-svg style="display: block; margin: auto;"[name]='icon' size='32'/>
        </div>
      </div>
  `))]
}

