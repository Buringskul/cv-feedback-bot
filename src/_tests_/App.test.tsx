import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders TailorMyCV homepage title', () => {
  render(<App />);
  expect(screen.getByText(/TailorMyCV/i)).toBeInTheDocument();
});
