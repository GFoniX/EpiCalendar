export interface IScheduleRdv {
  scolaryear: string;
  codemodule: string;
  codeinstance: string;
  codeacti: string;
  nb_notes: number;
  register_by_bloc: boolean;
  projects?: (ProjectsEntity)[] | null;
  events?: (EventsEntity)[] | null;
  title: string;
  description: string;
  instance_location: string;
  module_title: string;
  project: Project;
  with_project: boolean;
  nb_registered: number;
  nb_slots_full: number;
  slots?: (SlotsEntity)[] | null;
  group?: Group | null;
  student_registered?: boolean | null;
}
export interface ProjectsEntity {
  title: string;
  codeacti: string;
  id_projet?: string | null;
}
export interface EventsEntity {
  id: string;
  nb_registered: string;
  begin: string;
  register: string;
  num_event: string;
  end: string;
  location: string;
  title: string;
  date_ins?: null;
  date_modif?: null;
}
export interface Project {
  id: number;
  scolaryear: string;
  codemodule: string;
  codeinstance: string;
  title: string;
}
export interface SlotsEntity {
  id: number;
  title: string;
  bloc_status: string;
  room: string;
  slots?: (SlotsEntity1)[] | null;
  codeevent: string;
}
export interface SlotsEntity1 {
  acti_title: string;
  date: string;
  duration: number;
  status: string;
  bloc_status: string;
  id_team?: string | null;
  id_user?: null;
  date_ins?: string | null;
  code?: string | null;
  title?: string | null;
  module_title: string;
  members_pictures?: string | null;
  past: number;
  master?: MembersEntityOrMaster | null;
  members?: (MembersEntityOrMaster1 | null)[] | null;
  id: number;
  note?: number | null;
}
export interface MembersEntityOrMaster {
  login: string;
  title: string;
  picture: string;
}
export interface MembersEntityOrMaster1 {
  login: string;
  title: string;
  picture: string;
}
export interface Group {
  id: number;
  code: string;
  title: string;
  inscrit: boolean;
  master: string;
  members?: (string)[] | null;
}
