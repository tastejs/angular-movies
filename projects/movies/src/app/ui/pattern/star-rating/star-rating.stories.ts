import { Meta, StoryObj } from '@storybook/angular';
import { StarRatingComponent } from './star-rating.component';
import {
  withBothColorScheme,
  wrappedInPaddedDiv,
} from '../../../../../.storybook/decorators';

const meta: Meta = {
  title: 'Patterns/Star Rating',
  component: StarRatingComponent,
  tags: ['autodocs'],
  decorators: [wrappedInPaddedDiv, withBothColorScheme],
  args: {
    showRating: false,
  },
  argTypes: {
    rating: {
      control: {
        type: 'number',
        min: 0,
        max: 10,
        step: 0.1,
      },
      description:
        'A rating as a number from 1 to 10 which decided the number of stars',
    },
    showRating: {
      control: {
        type: 'boolean',
      },
      description: 'Weather or not to show the rating as a number',
    },
  },
};
export default meta;
type Story = StoryObj<StarRatingComponent>;

export const Full: Story = {
  args: {
    showRating: true,
    rating: 10,
  },
};

export const MidFull: Story = {
  args: {
    showRating: true,
    rating: 5,
  },
};

export const Empty: Story = {
  args: {
    showRating: true,
    rating: 0,
  },
};
