import { Meta, StoryObj } from '@storybook/angular';
import { HamburgerButtonComponent } from './hamburger-button.component';


const meta: Meta = {
  title: 'Component/Hamburger',
  component: HamburgerButtonComponent,
};
export default meta;

type Story = StoryObj<StoryObj>;

export const Hambuger: Story = {args: {}};


