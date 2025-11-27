import * as React from 'react';

export function useUserSelection<T = string>(initialIds: T[] = []) {
  const [selected, setSelected] = React.useState<Set<T>>(new Set());

  const handleSelectOne = (id: T) => {
    setSelected((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    setSelected((prev) => {
      if (prev.size === initialIds.length) {
        return new Set();
      }
      return new Set(initialIds);
    });
  };

  const isSelected = (id: T) => selected.has(id);

  return {
    selected,
    isSelected,
    handleSelectOne,
    handleSelectAll,
  };
}
