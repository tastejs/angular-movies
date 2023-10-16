import { Meta, StoryObj } from '@storybook/angular';
import { StarRatingComponent } from './star-rating.component';

const meta: Meta = {
  title: 'Patterns/Star Rating',
  component: StarRatingComponent,
  tags: ['autodocs'],
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
