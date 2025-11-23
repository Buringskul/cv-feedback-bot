import { render, screen } from '@testing-library/react';
import App from '../App';

// Heartbeat test
test('heartbeat UI test - App renders', () => {
  render(<App />);
});

// Homepage render test
test('renders TailorMyCV homepage title', () => {
  render(<App />);
  expect(screen.getByText(/CV Score/i)).toBeInTheDocument();
});
