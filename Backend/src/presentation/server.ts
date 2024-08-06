import express, { Router } from 'express';
import path from 'path';
import swaggeUi from 'swagger-ui-express';
import cors from'cors';
import swaggerDocument from './../docs/swagger.json';

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}


export class Server {

  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  async start() {
    
    this.app.use(cors());
    this.app.use( express.json() );
    this.app.use( express.urlencoded({ extended: true }) );

    this.app.use( express.static( this.publicPath ) );

    this.app.use( this.routes );
    this.app.use('/api-docs', swaggeUi.serve,swaggeUi.setup(swaggerDocument))
    
    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${ this.port }`);
    });
  }

  public close() {
    this.serverListener?.close();
  }

}