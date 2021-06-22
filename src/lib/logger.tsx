import { Logger, ILogOptions } from '@7dev-works/logger';

const options: ILogOptions = {
    useColor: true,
    logInFile: false
};

const logger: Logger = new Logger(options);

export default logger;