import { RateService } from './rate.service';
import { RateModel } from '../../data/mongo/models/rate.model';
import { CustomError } from '../../domain';

export class ScheduleService {
    private rateService: RateService;
    private intervalId: NodeJS.Timeout | null;

    constructor(rateService: RateService) {
        this.rateService = rateService;
        this.intervalId = null;
    }

    start(interval: number = 30000) {
        this.intervalId = setInterval(async () => {
            try {
                const rateData = await this.rateService.getRate();
                if (rateData && typeof rateData !== 'boolean') {
                    const newRate = new RateModel(rateData);
                    await newRate.save();
                }
            } catch (error) {
                this.restart();
                throw CustomError.internalServer(`${error}`);
            }
        }, interval);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            throw CustomError.internalServer(`Scheduled task stopped`);
        }
    }

    restart(interval: number = 30000) {
        this.stop();
        setTimeout(() => this.start(interval), 5000);
        throw CustomError.internalServer(`Restarting scheduled task..`);
    }
}
