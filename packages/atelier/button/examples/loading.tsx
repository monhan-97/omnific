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
      <Button color='primary' loading variant='solid'>
        提交中
      </Button>

      <Button aria-label='加载中' color='primary' icon={<EyeIcon />} loading variant='solid' />

      <Button color='primary' loading={loading} variant='solid'>
        提交
      </Button>

      <Button color='default' onClick={toggleLoading} variant='outlined'>
        {loading ? '停止加载' : '开始加载'}
      </Button>
    </div>
  );
};
