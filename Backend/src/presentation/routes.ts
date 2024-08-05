import { Router } from 'express';
import { Authroutes } from './auth/routes';
import { ExchangeRateRoutes } from './exchangeRate/routes';

export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    router.use('/api/auth', Authroutes.routes );
    router.use('/api/exchange', ExchangeRateRoutes.routes );

    return router;
  }


}

