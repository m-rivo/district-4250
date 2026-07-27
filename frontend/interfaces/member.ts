import { Club } from "./club";
import { Role } from "./role";

export interface Member {
  id: string;
  first_name: string;
  second_name?: string;
  first_surname: string;
  second_surname?: string;
  club: Club;
  roles: Role[];
  is_active: boolean;
  birth_date: string;
  profile_picture?: string;
}
