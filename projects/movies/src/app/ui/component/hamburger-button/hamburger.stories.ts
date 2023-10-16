import { Meta, StoryObj } from '@storybook/angular';
import { HamburgerButtonComponent } from './hamburger-button.component';
import {
  withBothColorScheme,
  wrappedInPaddedDiv,
} from '../../../../../.storybook/decorators';

const meta: Meta = {
  title: 'Component/Hamburger',
  component: HamburgerButtonComponent,
  decorators: [wrappedInPaddedDiv, withBothColorScheme],
};
export default meta;

type Story = StoryObj<StoryObj>;

export const Hambuger: Story = { args: {} };
