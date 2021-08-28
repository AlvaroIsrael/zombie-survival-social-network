export type ISurvivorRequest = {
  name: string;
  age: number;
  sex: 'M' | 'F';
  latitude: number;
  longitude: number;
  infected: boolean;
};
