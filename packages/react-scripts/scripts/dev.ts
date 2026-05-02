import { createRequire } from 'node:module';
import { exit } from 'node:process';
import { styleText } from 'node:util';

import { RspackDevServer } from '@rspack/dev-server';

import { choosePort, createCompiler, prepareUrls } from '../utils/dev-server-utils';
import clearConsole from '../utils/clear-console';
import paths from '../paths';
import createRspackConfig from '../rspack.config';
import createDevelopmentServerConfig from '../rspack-dev-server';

const require = createRequire(import.meta.url);

//检测是不是在终端执行命令
const isInteractive = process.stdout.isTTY;

const developmentServerConfig = {
  PORT: 3000,
  HOST: '0.0.0.0',
  PROTOCOL: 'http',
};

async function startDevelopment() {
  try {
    const port = await choosePort({
      port: developmentServerConfig.PORT,
    });

    if (port === undefined) {
      return;
    }

    const config = await createRspackConfig();

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
      config,
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

await startDevelopment();
