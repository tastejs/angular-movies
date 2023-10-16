import { Meta, StoryObj } from '@storybook/angular';
import { SideDrawerComponent } from './side-drawer.component';

const meta: Meta = {
  title: 'Component/Side Drawer',
  component: SideDrawerComponent,
  argTypes: {
    opened: {
      controls: 'boolean',
      description: 'Defines if the drawer is opened or closed',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
};
export default meta;
type Story = StoryObj<SideDrawerComponent>;

export const Opened: Story = {
  args: { opened: true },
  render: (args) => ({
    template: `
      <ui-side-drawer [opened]='${args.opened}'>
        Example Drawer Content
      </ui-side-drawer>
    `,
  }),
};
export const Closed: Story = {
  args: { opened: false },
  render: (args) => ({
    template: `
      <ui-side-drawer [opened]='${args.opened}'>
        Example Drawer Content
      </ui-side-drawer>
    `,
  }),
};
