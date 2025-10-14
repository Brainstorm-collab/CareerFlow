import { useState, useCallback, useRef } from 'react';

const useOptimisticUpdates = (initialData = []) => {
  const [optimisticData, setOptimisticData] = useState(initialData);
  const [realData, setRealData] = useState(initialData);
  const pendingUpdates = useRef(new Map());

  // Apply optimistic update immediately
  const applyOptimisticUpdate = useCallback((updateFn, updateId) => {
    setOptimisticData(prev => updateFn(prev));
    
    // Store the update for potential rollback
    pendingUpdates.current.set(updateId, updateFn);
  }, []);

  // Confirm optimistic update with real data
  const confirmUpdate = useCallback((updateId, realData) => {
    setRealData(realData);
    setOptimisticData(realData);
    pendingUpdates.current.delete(updateId);
  }, []);

  // Rollback optimistic update on error
  const rollbackUpdate = useCallback((updateId) => {
    const updateFn = pendingUpdates.current.get(updateId);
    if (updateFn) {
      // Revert the optimistic update
      setOptimisticData(prev => {
        // This is a simplified rollback - in real implementation,
        // you'd need to store the inverse operation
        return realData;
      });
      pendingUpdates.current.delete(updateId);
    }
  }, [realData]);

  // Update real data (from server)
  const updateRealData = useCallback((newData) => {
    setRealData(newData);
    setOptimisticData(newData);
  }, []);

  return {
    data: optimisticData,
    realData,
    applyOptimisticUpdate,
    confirmUpdate,
    rollbackUpdate,
    updateRealData
  };
};

export default useOptimisticUpdates;
