import * as React from 'react';

export interface Selection<T = string> {
  deselectAll: () => void;
  deselectOne: (key: T) => void;
  selectAll: () => void;
  selectOne: (key: T) => void;
  selected: Set<T>;
  selectedAny: boolean;
  selectedAll: boolean;

  isSelected: (key: T) => boolean;
  handleSelectOne: (key: T) => void;
  handleSelectAll: () => void;
}

export function userUserSelection<T = string>(keys: T[] = []): Selection<T> {
  const [selected, setSelected] = React.useState<Set<T>>(new Set());

  React.useEffect(() => {
    setSelected(new Set());
  }, [keys]);

  const deselectAll = React.useCallback(() => {
    setSelected(new Set());
  }, []);

  const deselectOne = React.useCallback((key: T) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.delete(key);
      return copy;
    });
  }, []);

  const selectAll = React.useCallback(() => {
    setSelected(new Set(keys));
  }, [keys]);

  const selectOne = React.useCallback((key: T) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.add(key);
      return copy;
    });
  }, []);

  // Additional helpers
  const isSelected = React.useCallback((key: T) => selected.has(key), [selected]);
  const handleSelectOne = React.useCallback((key: T) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      if (copy.has(key)) {
        copy.delete(key);
      } else {
        copy.add(key);
      }
      return copy;
    });
  }, []);

  const handleSelectAll = React.useCallback(() => {
    setSelected((prev) => {
      if (prev.size === keys.length) {
        return new Set();
      }
      return new Set(keys);
    });
  }, [keys]);

  return {
    deselectAll,
    deselectOne,
    selectAll,
    selectOne,
    selected,
    selectedAny: selected.size > 0,
    selectedAll: selected.size === keys.length,

    isSelected,
    handleSelectOne,
    handleSelectAll,
  };
}
