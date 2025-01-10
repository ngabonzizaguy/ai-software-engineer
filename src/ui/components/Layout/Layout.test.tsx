import React from 'react';
import { render, screen } from '@testing-library/react';
import { Layout } from './Layout';

describe('Layout', () => {
  it('renders children correctly', () => {
    const testText = 'Test Content';
    render(
      <Layout>
        <div>{testText}</div>
      </Layout>
    );

    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  it('has layout class', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByText('Content').parentElement).toHaveClass('layout');
  });
}); 