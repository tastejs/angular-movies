import { Meta, StoryObj } from '@storybook/angular';

import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { DarkModeToggleComponent } from './dark-mode-toggle.component';

const meta: Meta = {
  title: 'Component/DarkModeToggle',
  component: DarkModeToggleComponent,
  tags: ['autodocs'],
  parameters: {
    controls: {
      disabled: true,
    }
  }
}
export default meta;

type Story = StoryObj<DarkModeToggleComponent>;

export const ToggleButtonsMode: Story = {
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    await expect(buttons.length).toEqual(2);

    const lightModeBtn = buttons.filter(value => (
      value.classList.contains('light')
    )).at(0)
    const darkModeBtn = buttons.filter(value => (
      value.classList.contains('dark')
    )).at(0)

    await step('Click dark mode buttons', async () => {
      await expect(darkModeBtn).toBeInTheDocument();
      await userEvent.click(darkModeBtn!);
      await expect(document.body.classList).toContain('dark');
    });

    await step('Click light mode buttons', async () => {
      await expect(lightModeBtn).toBeInTheDocument();
      await userEvent.click(lightModeBtn!);
      await expect(document.body.classList).toContain('light');
    });
  },
};
