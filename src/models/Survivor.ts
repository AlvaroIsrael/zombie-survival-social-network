import { ISurvivorRequest } from 'interfaces/ISurvivorRequest';

class Survivor {
  name: string;

  age: number;

  sex: 'M' | 'F';

  latitude: number;

  longitude: number;

  infected: boolean;

  constructor({ name, age, sex, latitude, longitude, infected }: ISurvivorRequest) {
    this.name = name;
    this.age = age;
    this.sex = sex;
    this.latitude = latitude;
    this.longitude = longitude;
    this.infected = infected;
  }
}

export default Survivor;
