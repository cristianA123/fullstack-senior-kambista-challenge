import { Response, Request } from 'express';
import { CustomError, PaginationDto } from '../../domain';
import { CreateExchangeRateDto } from '../../domain/dtos/exchangeRate/create-exchangeRate.dto';
import { ExchangeRateService } from '../services/exchangeRate.service';

export class ExchangeRateController {

  constructor(
    private readonly exchangeRateService: ExchangeRateService,
  ) { }


  private handleError = ( error: unknown, res: Response ) => {
    if ( error instanceof CustomError ) {
      return res.status( error.statusCode ).json( { error: error.message } );
    }

    console.log( `${ error }` );
    return res.status( 500 ).json( { error: 'Internal server error' } );
  };

  createExchangeRate = ( req: Request, res: Response ) => {

    const [ error, createExchangeRateDto ] = CreateExchangeRateDto.create( req.body );
    if ( error ) return res.status( 400 ).json( { error } );


    this.exchangeRateService.createExchangeRate( createExchangeRateDto!, req.body.user )
      .then( category => res.status( 201 ).json( category ) )
      .catch( error => this.handleError( error, res ) );


  };

  getExchangeRate = async ( req: Request, res: Response ) => {

    const { page = 1, limit = 10 } = req.query;
    const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
    if ( error ) return res.status(400).json({ error });
    
    this.exchangeRateService.getExchangeRates( paginationDto! )
      .then( categories => res.json( categories ))
      .catch( error => this.handleError( error, res ) );

  };

}