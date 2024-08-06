import { Router } from "express";
import { ExchangeRateController } from "./controller";
import { ExchangeRateService } from "../services/exchangeRate.service";
import { RateService } from "../services/rate.service";
import { envs } from "../../config";
import { ScheduleService } from "../services/schedule.service";

export class ExchangeRateRoutes {


    static get routes(): Router {

        const router = Router();

        const rateService = new RateService(
            envs.SERVICE_URL_RATE
        );

        const scheduleService = new ScheduleService(rateService);

        scheduleService.start();

        const exchangeRateService = new ExchangeRateService(rateService);

        const controller = new ExchangeRateController(exchangeRateService);

        router.post('/', controller.createExchangeRate);
        router.get('/', controller.getExchangeRate);

        return router;
    }
}
