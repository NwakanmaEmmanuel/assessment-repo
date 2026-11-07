import { act, fireEvent, render, screen } from '@testing-library/react';
import { useCallback, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { Restaurant } from '../types';

// RestaurantImage is rendered once per card render, so counting its renders counts card renders.
const imageRenders = vi.fn();
vi.mock('../components/RestaurantImage', () => ({
  RestaurantImage: ({ alt }: { alt: string }) => {
    imageRenders(alt);
    return <span>{alt}</span>;
  },
}));

import { RestaurantGrid } from '../components/RestaurantGrid';

const many: Restaurant[] = Array.from({ length: 60 }, (_, i) => ({
  id: `r${i}`,
  name: `Buka ${i}`,
  cuisineType: 'Nigerian',
  rating: 4,
  photoUrl: '',
  tags: ['Jollof'],
  isFavorited: false,
}));

function Harness() {
  const [list, setList] = useState(many);
  const [typed, setTyped] = useState('');
  // Same strategy as useDashboard: replace only the changed object, keep the callback stable.
  const toggle = useCallback((id: string) => {
    setList((l) => l.map((r) => (r.id === id ? { ...r, isFavorited: !r.isFavorited } : r)));
  }, []);
  return (
    <>
      <input aria-label="search" value={typed} onChange={(e) => setTyped(e.target.value)} />
      <RestaurantGrid restaurants={list} onToggleFavorite={toggle} />
    </>
  );
}

describe('RestaurantCard memoisation (60 cards)', () => {
  it('favouriting one card re-renders only that card', () => {
    render(<Harness />);
    expect(imageRenders).toHaveBeenCalledTimes(60);
    imageRenders.mockClear();
    act(() => {
      fireEvent.click(screen.getByLabelText('Save Buka 7 to favourites'));
    });
    expect(imageRenders).toHaveBeenCalledTimes(1);
    expect(imageRenders).toHaveBeenCalledWith('Buka 7');
  });

  it('typing in the parent does not re-render any card', () => {
    render(<Harness />);
    imageRenders.mockClear();
    act(() => {
      fireEvent.change(screen.getByLabelText('search'), { target: { value: 'ama' } });
    });
    expect(imageRenders).not.toHaveBeenCalled();
  });
});
