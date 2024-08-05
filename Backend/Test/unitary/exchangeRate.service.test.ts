
import { ExchangeRateService } from './../../src/presentation/services/exchangeRate.service';

import { CreateExchangeRateDto } from './../../src/domain/dtos/exchangeRate/create-exchangeRate.dto';
import { UserEntity } from './../../src/domain';
import { CustomError } from './../../src/domain';
import { ExchangeRateModel } from './../../src/data';
import { RateService } from '../../src/presentation/services/rate.service';
import { envs } from '../../src/config';

describe('ExchangeRateService', () => {
    let exchangeRateService: ExchangeRateService;
    let rateService: RateService;

    beforeEach(() => {
        rateService = new RateService(
            envs.SERVICE_URL_RATE
        );
        exchangeRateService = new ExchangeRateService(rateService);
    });

    describe('createExchangeRate', () => {
        it('should create an exchange rate successfully', async () => {
            // Arrange
            const createExchangeRateDto: CreateExchangeRateDto = {
                monedaOrigen: 'USD',
                monedaDestino: 'PEN',
                monto: 100,
                montoCambiado: 0,
                tipoCambio: 0,
                fecha: new Date("2024-01-18")
            };
            const user: UserEntity = {
                id: 'user-id',
                name: '',
                email: '',
                emailValidated: false,
                password: '',
                role: []
            };

            // Act
            const response = await exchangeRateService.createExchangeRate(createExchangeRateDto, user);

            // Assert
            expect(response.success).toBe(true);
            // expect(response.message).toBe('Se cambio la moneda exitosamente');
            // expect(response.data).toEqual({});

            // // Additional assertions for database interactions
            // const savedExchangeRate = await ExchangeRateModel.findOne({ user: user.id });
            // expect(savedExchangeRate).not.toBeNull();
            // expect(savedExchangeRate).toBeDefined();
            // if (savedExchangeRate !== null) {
            //     expect(savedExchangeRate.monedaOrigen).toBe(createExchangeRateDto.monedaOrigen);
            //     expect(savedExchangeRate.monedaDestino).toBe(createExchangeRateDto.monedaDestino);
            //     expect(savedExchangeRate.monto).toBe(createExchangeRateDto.monto);
            //     expect(savedExchangeRate.montoCambiado).toBeDefined();
            //     expect(savedExchangeRate.tipoCambio).toBeDefined();
            //     expect(savedExchangeRate.fecha).toBeDefined();
            // }
        });

        // it('should throw an error when rate data is not available', async () => {
        //     // Arrange
        //     const createExchangeRateDto: CreateExchangeRateDto = {
        //         monedaOrigen: 'USD',
        //         monedaDestino: 'PEN',
        //         monto: 100,
        //         montoCambiado: 0,
        //         tipoCambio: 0,
        //         fecha: new Date()
        //     };
        //     const user: UserEntity = {
        //         id: 'user-id',
        //         name: '',
        //         email: '',
        //         emailValidated: false,
        //         password: '',
        //         role: []
        //     };
        //     jest.spyOn(rateService, 'getRate').mockResolvedValue({
        //         compra: 3.733,
        //         venta: 3.739,
        //         origen: "SUNAT",
        //         moneda: "USD",
        //         fecha: expect.any(Date)
        //       });

        //     // Act & Assert
        //     await expect(exchangeRateService.createExchangeRate(createExchangeRateDto, user)).rejects.toThrow(
        //         CustomError.badRequest('No se pudo conectar a la Api Externa, Intente hacer la operacion mas tarde.')
        //     );
        // });

        // Add more test cases for different scenarios
    });

    // describe('getExchangeRates', () => {
    //     it('should return a list of exchange rates with pagination', async () => {
    //         // Arrange
    //         const paginationDto = { page: 1, limit: 10 };

    //         // Act
    //         const response = await exchangeRateService.getExchangeRates(paginationDto);

    //         // Assert
    //         expect(response.success).toBe(true);
    //         expect(response.message).toBe('Lista de cambios de moneda');
    //         expect(response.data).toBeDefined();
    //         expect(response.data.page).toBe(paginationDto.page);
    //         expect(response.data.limit).toBe(paginationDto.limit);
    //         expect(response.data.total).toBeDefined();
    //         expect(response.data.next).toBeDefined();
    //         expect(response.data.prev).toBeNull();
    //         expect(response.data.exchangeRates).toBeDefined();
    //         expect(response.data.exchangeRates.length).toBeGreaterThan(0);
    //     });

    //     // Add more test cases for different scenarios
    // });
});