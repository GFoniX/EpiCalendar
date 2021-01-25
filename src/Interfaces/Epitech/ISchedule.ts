import { SlotsEntity1 } from './IScheduleRdv';

export interface ISchedule {
  scolaryear: string;
  codemodule: string;
  codeinstance: string;
  codeacti: string;
  codeevent: string;
  semester: number;
  instance_location: string;
  titlemodule: string;
  prof_inst?: (IProfInstEntity)[] | null;
  acti_title: string;
  num_event: number;
  start: string;
  end: string;
  total_students_registered: number;
  title?: string | null;
  type_title: string;
  type_code: string;
  is_rdv: string;
  nb_hours: string;
  allowed_planning_start: string;
  allowed_planning_end: string;
  nb_group: number;
  nb_max_students_projet?: string | null;
  room?: IRoom | null;
  dates?: null;
  module_available: boolean;
  module_registered: boolean;
  past: boolean;
  allow_register: boolean;
  event_registered: boolean | string;
  display: string;
  project: boolean;
  rdv_group_registered?: string | null;
  rdv_indiv_registered?: null;
  allow_token: boolean;
  register_student: boolean;
  register_prof: boolean;
  register_month: boolean;
  in_more_than_one_month: boolean;
  rdv?: SlotsEntity1 | undefined;
}
export interface IProfInstEntity {
  type: string;
  login: string;
  title?: string | null;
  picture?: string | null;
}
export interface IRoom {
  code?: string | null;
  type?: string | null;
  seats?: number | null;
}
