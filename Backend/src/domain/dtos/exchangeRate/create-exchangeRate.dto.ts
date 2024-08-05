export class CreateExchangeRateDto {

    private constructor(
        public readonly monedaOrigen: string,
        public readonly monedaDestino: string,
        public readonly monto: number,
        public readonly montoCambiado: number,
        public readonly tipoCambio: number,
        public readonly fecha: Date,
    ) { }


    static create(props: { [key: string]: any }): [string?, CreateExchangeRateDto?] {

        const { 
            monedaOrigen,
            monedaDestino,
            monto,
            montoCambiado,
            tipoCambio,
            fecha } = props;

        if (!monedaOrigen) return ['Es olbigatorio el campo monedaOrigen'];
        if (!monedaDestino) return ['Es olbigatorio el campo monedaDestino'];
        if (!monto) return ['Es olbigatorio el campo monto'];

        const decimalRegEx = /^\d+(\.\d{1,2})?$/;
         if (!decimalRegEx.test(monto.toString())) {
             return ['El monto debe tener como máximo 2 decimales'];
         }
 
         const integerPart = Math.floor(monto).toString();
         if (integerPart.length > 7) {
             return ['El monto no debe tener más de 7 dígitos enteros'];
         }

        return [
            undefined, 
            new CreateExchangeRateDto(
                monedaOrigen, 
                monedaDestino, 
                monto, 
                montoCambiado, 
                tipoCambio,
                fecha
            )
        ];
    }
}