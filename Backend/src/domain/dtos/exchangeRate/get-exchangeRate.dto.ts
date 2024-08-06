export class GetExchangeRateDto {

    private constructor(
        public readonly startDate?: Date,
        public readonly endDate?: Date,
    ) { }

    static create(props: { [key: string]: any }): [string?, GetExchangeRateDto?] {

        const { startDate, endDate } = props;

        const convertToDate = (dateStr: string): Date | null => {
            const [day, month, year] = dateStr.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            return !isNaN(date.getTime()) ? date : null;
        };

        const isValidDate = (date: any) => {
            return date instanceof Date && !isNaN(date.getTime());
        };

        if (startDate && !isValidDate(new Date(startDate))) {
            return ["Invalido Fecha de inicio"];
        }

        if (endDate && !isValidDate(new Date(endDate))) {
            return ["Invalido Fecha de fin"];
        }

        const start = startDate ? convertToDate(startDate) || undefined : undefined;
        const end = endDate ? convertToDate(endDate) || undefined : undefined;

        if (start && end && start > end) {
            return ["Fecha de inicio debe ser menor a la fecha de fin"];
        }

        return [
            undefined, 
            new GetExchangeRateDto(start, end)
        ];
    }
}
