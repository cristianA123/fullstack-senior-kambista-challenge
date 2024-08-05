import { envs } from './../../config';
import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../services';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class Authroutes {


  static get routes(): Router {

    const router = Router();

    const authService = new AuthService();

    const controller = new AuthController(authService);
    
    // Definir las rutas
    router.post('/login', controller.loginUser );
    router.get('/me', [ AuthMiddleware.validateJWT ], controller.me );
    router.post('/register', controller.registerUser );
    
    router.get('/validate-email/:token', controller.validateEmail );

    return router;
  }


}

