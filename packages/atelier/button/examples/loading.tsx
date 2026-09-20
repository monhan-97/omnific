import { useState } from 'react';
import { EyeIcon } from '@omnific/icons';

import { Button } from '@omnific/atelier';

/**
 * 展示 Button 的加载状态。
 */
export const ButtonLoadingExample = () => {
  const [loading, setLoading] = useState(false);

  const toggleLoading = () => {
    if (loading) {
      setLoading(false);
      return;
    }
    setLoading(true);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <Button loading variant='primary'>
        提交中
      </Button>

      <Button aria-label='加载中' icon={<EyeIcon />} loading variant='primary' />

      <Button loading={loading} variant='primary'>
        提交
      </Button>

      <Button variant='secondary' onClick={toggleLoading}>
        {loading ? '停止加载' : '开始加载'}
      </Button>
    </div>
  );
};
