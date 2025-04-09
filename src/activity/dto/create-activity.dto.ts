import { SessionType } from "../entities/activity.entity";

export class CreateActivityDto {
    type: SessionType;
    startTime: Date;
    duration: number; // en secondes
    distance: number; // en mètres
    name: string;
    comment?: string;
}