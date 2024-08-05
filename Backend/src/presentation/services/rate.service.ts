
import axios from 'axios';
export interface RateResponse {
    compra: number;
    venta: number;
    origen: string;
    moneda: string;
    fecha: Date;
}


export class RateService {
    private apiRateUrl: string;

    constructor(apiRateUrl: string ) { 
        this.apiRateUrl = apiRateUrl;
    }

    async getRate(): Promise<RateResponse | boolean> {

        try {
            const { data } = await axios.get<RateResponse>(this.apiRateUrl);
            return data;

        } catch (error) {
            return false;
        }
    }
}