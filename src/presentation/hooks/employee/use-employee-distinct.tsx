// use-employee-distinct.ts
import { useCallback, useState } from 'react';
import { GetEmployeeDistinctRequest } from '@/domain/models/employee/request/get-employee-distinct-request';
import { EmployeeDistinctResponse } from '@/domain/models/employee/response/employee-distinct-response';
import { EmployeeUsecase } from '@/domain/usecases/employee/employee-usecase';
import { DepartmentFilterType } from '@/utils/enum/employee-enum';

export function useEmployeeDistinct(usecase: EmployeeUsecase | null, type: number | undefined) {
  const [items, setItems] = useState<EmployeeDistinctResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    if (!usecase || type === undefined || loaded) return;

    try {
      setLoading(true);
      const enumKey = DepartmentFilterType[type] as keyof typeof DepartmentFilterType;

      const request = new GetEmployeeDistinctRequest({
        type: enumKey,
      });

      const result = await usecase.getEmployeeDistinct(request);
      setItems(result);
      setLoaded(true);
    } catch (error) {
      console.error('Failed to load employee distinct', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [usecase, type, loaded]);

  return { items, loading, load, loaded };
}
