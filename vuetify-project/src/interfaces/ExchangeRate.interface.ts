export interface ExchangeRate {
    id: number,
    monedaOrigen: string,
    monedaDestino: string,
    monto: number,
    montoCambiado: number,
    tipoCambio: number,
    fecha: Date
}

export interface DataResponseExchangeRate {
    page?: number,
    limit?: number,
    total?: number,
    next?: string,
    prev?: string | null,
    exchangeRates: ExchangeRate[]
}

export interface ResponseExchangeRate {
    success: boolean,
    message: string,
    data: DataResponseExchangeRate
}
