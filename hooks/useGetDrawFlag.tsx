import { useRecoilValue } from 'recoil';
import { DrawLineRecoil } from '@atoms';

export default function useGetDrawFlag() {
  const { drawFlag } = useRecoilValue(DrawLineRecoil);
  return drawFlag;
}
