import { componentWrapperDecorator, Meta, StoryObj } from '@storybook/angular';
import { BackdropComponent } from './backdrop.component';
import { withBothColorScheme } from '../../../../../.storybook/decorators';

const meta: Meta = {
  title: 'Component/Backdrop',
  component: BackdropComponent,
  decorators: [
    componentWrapperDecorator((story) => (`
      <div style='height: 100px;'> ${story}
        <h1 style='text-align: center;'>Content In Background</h1>
      </div>
    `)),
    withBothColorScheme()
  ]
};
export default meta;

type Story = StoryObj<BackdropComponent>;

export const Default: Story = { args: { opened: true }};
