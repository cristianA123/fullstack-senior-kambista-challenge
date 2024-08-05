import { Response, Request } from 'express';
import { ExchangeRateController } from './../../src/presentation/exchangeRate/controller'
import { ExchangeRateService } from './../../src/presentation/services/exchangeRate.service';
import { RateService } from '../../src/presentation/services/rate.service';
import { envs } from '../../src/config';

describe('ExchangeRateController', () => {
  let exchangeRateController: ExchangeRateController;
  let exchangeRateService: ExchangeRateService;
  let rateService: RateService;

  beforeEach(() => {
    rateService = new RateService( envs.SERVICE_URL_RATE);
    exchangeRateService = new ExchangeRateService(rateService);
    exchangeRateController = new ExchangeRateController(exchangeRateService);
  });

  describe('createExchangeRate', () => {
    it('should return 201 status code and created exchange rate', async () => {
      const req = { body: { /* mock request body */ } } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      exchangeRateService.createExchangeRate = jest.fn().mockResolvedValue(/* mock created exchange rate */);

      await exchangeRateController.createExchangeRate(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(/* mock created exchange rate */);
    });

    it('should return 400 status code and error message if createExchangeRateDto is invalid', async () => {
      const req = { body: { /* mock request body */ } } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      const error = 'Invalid createExchangeRateDto';
      const createExchangeRateDto = null; // Set to null to simulate invalid createExchangeRateDto

      exchangeRateService.createExchangeRate = jest.fn().mockResolvedValue(/* mock created exchange rate */);
      jest.spyOn(CreateExchangeRateDto, 'create').mockReturnValue([error, createExchangeRateDto]);

      await exchangeRateController.createExchangeRate(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error });
    });

    it('should return 500 status code and error message if an error occurs', async () => {
      const req = { body: { /* mock request body */ } } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      const error = new Error('Internal server error');

      exchangeRateService.createExchangeRate = jest.fn().mockRejectedValue(error);

      await exchangeRateController.createExchangeRate(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getExchangeRate', () => {
    it('should return exchange rates with 200 status code', async () => {
      const req = { query: { page: '1', limit: '10' } } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      const exchangeRates = [/* mock exchange rates */];

      exchangeRateService.getExchangeRates = jest.fn().mockResolvedValue(exchangeRates);

      await exchangeRateController.getExchangeRate(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(exchangeRates);
    });

    it('should return 400 status code and error message if paginationDto is invalid', async () => {
      const req = { query: { page: 'invalid', limit: '10' } } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      const error = 'Invalid paginationDto';
      const paginationDto = null; // Set to null to simulate invalid paginationDto

      jest.spyOn(PaginationDto, 'create').mockReturnValue([error, paginationDto]);

      await exchangeRateController.getExchangeRate(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error });
    });

    it('should return 500 status code and error message if an error occurs', async () => {
      const req = { query: { page: '1', limit: '10' } } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      const error = new Error('Internal server error');

      exchangeRateService.getExchangeRates = jest.fn().mockRejectedValue(error);

      await exchangeRateController.getExchangeRate(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});