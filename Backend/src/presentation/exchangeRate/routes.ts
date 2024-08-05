import { Router } from "express";
import { ExchangeRateController } from "./controller";
import { ExchangeRateService } from "../services/exchangeRate.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { RateService } from "../services/rate.service";
import { envs } from "../../config";

export class ExchangeRateRoutes {


    static get routes(): Router {

        const router = Router();

        const rateService = new RateService(
            envs.SERVICE_URL_RATE
        );

        const exchangeRateService = new ExchangeRateService(rateService);

        const controller = new ExchangeRateController(exchangeRateService);

        router.post('/', [AuthMiddleware.validateJWT], controller.createExchangeRate);
        router.get('/', [AuthMiddleware.validateJWT], controller.getExchangeRate);

        return router;
    }
}
