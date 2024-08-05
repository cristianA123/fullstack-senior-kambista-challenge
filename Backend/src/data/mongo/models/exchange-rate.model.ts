import mongoose, { Schema } from 'mongoose';


const ExchangeRate = new mongoose.Schema( {

  monedaOrigen: {
    type: String,
    required: [ true, 'Moneda de Origen es obligatorio' ],
  },
  monedaDestino: {
    type: String,
    required: [ true, 'Moneda de destino es obligatorio' ],
  },
  monto: {
    type: Number,
    required: [ true, 'Monto es obligatorio' ],
  },
  montoCambiado: {
    type: Number,
  },
  tipoCambio: {
    type: Number,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
} );


export const ExchangeRateModel = mongoose.model('Exchange-Rate', ExchangeRate);

