import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import App from './App';


describe('App', () => {
  it('renders the INTERMAGNET brand link', async () => {
    window.history.pushState({}, 'Test', '/metadata/'); // <- make pathname start with the basename
    render(<App />);
    // uncomment the next line to see what the application renders:
    //screen.debug();
    // Brand is an anchor with accessible name "INTERMAGNET"
    const brand = await screen.findByRole('link', { name: /intermagnet/i });
    expect(brand).toBeInTheDocument();
  });
});

