import { ExchangeRateModel } from '../../data';
import { CustomError, PaginationDto, UserEntity } from '../../domain';
import { CreateExchangeRateDto } from '../../domain/dtos/exchangeRate/create-exchangeRate.dto';
import { GetExchangeRateDto } from '../../domain/dtos/exchangeRate/get-exchangeRate.dto';
import ResponseDTO from '../../domain/dtos/shared/response.dto';
import { RateResponse, RateService } from './rate.service';

export class ExchangeRateService {

    constructor(
        private readonly rateService: RateService,
    ) { }

    async createExchangeRate(createExchangeRateDto: CreateExchangeRateDto, user: UserEntity) {

        const response: ResponseDTO = { success: true, message: "Se cambio la moneda exitosamente", data: {} };

        try {
            
            const rateData = await this.rateService.getRate();
            if (!rateData) {
                throw CustomError.badRequest('No se pudo conectar a la Api Externa, Intente hacer la operacion mas tarde.')
            }
      
            let tipoCambio: number;

            const { compra, venta } = rateData as RateResponse;

            if (createExchangeRateDto.monedaOrigen === 'USD' && createExchangeRateDto.monedaDestino === 'PEN') {
              tipoCambio = venta;
            } else if (createExchangeRateDto.monedaOrigen === 'PEN' && createExchangeRateDto.monedaDestino === 'USD') {
              tipoCambio = compra;
            } else {
              throw CustomError.badRequest('Operación de cambio de moneda no soportada');
            }
      
            const montoCambiado = createExchangeRateDto.monto * tipoCambio;
      
            const exchangeRate = new ExchangeRateModel({
              ...createExchangeRateDto,
              montoCambiado,
              tipoCambio,
              user: user?.id || null,
              fecha: new Date()
            });
      
            await exchangeRate.save();

            return response;

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getExchangeRates(paginationDto: PaginationDto, getExchangeRateDto: GetExchangeRateDto) {

        const { page, limit } = paginationDto;
        const { startDate, endDate } = getExchangeRateDto;

        const response: ResponseDTO = { success: true, message: "Lista de cambios de moneda", data: {} };

        const filter: any = {};
        if (startDate || endDate) {
            filter.fecha = {};
            if (startDate) {
                console.log(endDate)
                console.log(startDate)
                filter.fecha.$gte = startDate;
            }
            if (endDate) {
                filter.fecha.$lte = endDate;
            }
        }

        try {

            const [total, exhangeRates] = await Promise.all([
                ExchangeRateModel.countDocuments(filter),
                ExchangeRateModel.find(filter)
                    .skip((page - 1) * limit)
                    .limit(limit)
            ]);

            response.data = {
                page: page,
                limit: limit,
                total: total,
                next: `/api/exhangeRates?page=${(page + 1)}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/exhangeRates?page=${(page - 1)}&limit=${limit}` : null,

                exchangeRates: exhangeRates.map(exchangeRate => ({
                    id: exchangeRate.id,
                    monedaOrigen: exchangeRate.monedaOrigen,
                    monedaDestino: exchangeRate.monedaDestino,
                    monto: exchangeRate.monto,
                    montoCambiado: exchangeRate.montoCambiado,
                    tipoCambio: exchangeRate.tipoCambio,
                    fecha: exchangeRate.fecha
                }))
            };

            return response;


        } catch (error) {
            console.log(error);
            throw CustomError.internalServer('Internal Server Error');
        }
    }

}


