import { v4 as uuidv4 } from "uuid";

export interface Tube {
   id: string;
   weight: number;
   blocked: boolean;
}

const MIN_TUBE_WEIGHT = 1000 * 1;
const MAX_TUBE_WEIGHT = 1000 * 15;

export const createTube = (): Tube => ({
   id: uuidv4(),
   weight: Math.floor(Math.random() * (MAX_TUBE_WEIGHT - MIN_TUBE_WEIGHT + 1)) + MIN_TUBE_WEIGHT,
   blocked: false,
});
