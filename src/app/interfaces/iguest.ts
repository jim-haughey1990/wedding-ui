export interface IGuest {
  user_id: number;
  title: string;
  first_name: string;
  last_name: string;
  gender: string;
  address_1: string;
  address_2: string;
  address_3: string;
  postcode: string;
  child: number;
  attending: number;
  transport_day: number;
  transport_night: number;
  starter: number;
  main: number;
  desert: number;
  dietry_reqs: string;
}
