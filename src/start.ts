// start.js setup from learnnode.com by Wes Bos
import Express, { Application, Request, Response, NextFunction } from 'express';
import * as Dotenv from 'dotenv';
Dotenv.config({ path: '.env' });
import { apiRoutes, viewRoutes } from './modules/index.js';
import { errorHandler } from './common/errors/index.js';
import helmet from 'helmet';
import { requestId } from './common/middleware/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Express application bootstrap:
 * - Loads environment variables
 * - Applies security headers via Helmet
 * - Injects request correlation id
 * - Parses JSON/urlencoded bodies
 * - Registers routes and error handlers
 */
const app: Application = Express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3010;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// security middleware
app.use(helmet());
// request correlation id
app.use(requestId);

// support json encoded and url-encoded bodies, mainly used for post and update
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', Express.static(path.join(__dirname, 'public')));

apiRoutes.forEach((router) => app.use('/api/v1', router));
viewRoutes.forEach((router) => app.use('/', router));

// 404 catch-all handler (middleware)
app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error('Resource not found', { cause: 404 });
  } catch (err) {
    next(err);
  }
});

// Error handler (last) - implemented a custom error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🍿 Express running → PORT ${port}`);
});
