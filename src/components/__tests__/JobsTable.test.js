import { render, screen } from '@testing-library/react';
import JobsTable from '../JobsTable';

test('renders Jobs Table header', () => {
  render(<JobsTable />);
  expect(screen.getByText(/Jobs Table/i)).toBeInTheDocument();
});