import { createRequire } from 'node:module';
import { exit } from 'node:process';
import { styleText } from 'node:util';

import { RspackDevServer } from '@rspack/dev-server';

import type { ScriptContext } from '../Service';
import { choosePort, createCompiler, prepareUrls } from '../utils/development-server-utilities';
import clearConsole from '../utils/clear-console';
import paths from '../paths';
import createDevelopmentServerConfig from '../rspack-development-server';

const require = createRequire(import.meta.url);

//检测是不是在终端执行命令
const isInteractive = process.stdout.isTTY;

const developmentServerConfig = {
  PORT: 3000,
  HOST: '0.0.0.0',
  PROTOCOL: 'http',
};

/**
 * 为当前应用启动本地开发服务器。
 */
export async function startDevelopment(context: ScriptContext) {
  const { rspackConfig } = context;

  try {
    const port = await choosePort({
      port: developmentServerConfig.PORT,
    });

    if (port === undefined) {
      return;
    }

    const appName = require(paths.appPackageJson).name;

    const urls = prepareUrls({
      protocol: developmentServerConfig.PROTOCOL,
      host: developmentServerConfig.HOST,
      port,
      pathname: paths.publicUrlOrPath.slice(0, -1),
    });

    const localUrlForBrowser = new URL(urls.localUrlForBrowser);

    // Create a webpack compiler that is configured with custom messages.
    const compiler = createCompiler({
      appName,
      config: rspackConfig,
      urls,
    });

    const serverConfig = {
      ...createDevelopmentServerConfig(),
      host: localUrlForBrowser.hostname,
      port: localUrlForBrowser.port,
      open: true,
    };

    const developmentServer = new RspackDevServer(serverConfig, compiler);

    developmentServer.startCallback(error => {
      if (isInteractive) {
        clearConsole();
      }
      console.log(styleText('cyan', 'Starting the development server...\n'));
    });

    developmentServer.stopCallback(error => {
      if (error) {
        console.log('Server stopped.', error);
      }
    });

    // Launch WebpackDevServer.
    for (const signal of ['SIGINT', 'SIGTERM']) {
      process.on(signal, () => {
        developmentServer.stop();
        process.exit();
      });
    }

    if (process.env.CI !== 'true') {
      // Gracefully exit when stdin ends
      process.stdin.on('end', function () {
        developmentServer.stop();
        exit();
      });
    }
  } catch (error: any) {
    if (error?.message) {
      console.log(error.message);
    }
    exit(1);
  }
}
