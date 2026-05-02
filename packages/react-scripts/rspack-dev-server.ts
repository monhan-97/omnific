import type { DevServer } from '@rspack/core';

import paths from './paths';
import ignoredFiles from './utils/ignored-files';

function createDevelopmentServerConfig() {
  const config: DevServer = {
    allowedHosts: 'all',
    client: {
      overlay: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
    //  启用生成文件的 gzip 压缩。
    compress: true,
    static: {
      directory: paths.appPublic,
      publicPath: [paths.publicUrlOrPath],
      //   默认情况下，来自 contentBase 的文件不会触发页面重新加载
      watch: {
        ignored: ignoredFiles(paths.appSrc),
      },
    },

    devMiddleware: {
      // It is important to tell WebpackDevServer to use the same "publicPath" path as
      // we specified in the webpack config. When homepage is '.', default to serving
      // from the root.
      // remove last slash so user can land on `/test` instead of `/test/`
      publicPath: paths.publicUrlOrPath.slice(0, -1),
    },

    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebook/create-react-app/issues/387.
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
  };

  return config;
}

export default createDevelopmentServerConfig;
