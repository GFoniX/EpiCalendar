export interface IModule {
  scolaryear: string;
  codemodule: string;
  codeinstance: string;
  semester: number;
  scolaryear_template: string;
  title: string;
  begin: string;
  end_register: string;
  end: string;
  past: string;
  closed: string;
  opened: string;
  user_credits: string;
  credits: number;
  description: string;
  competence?: null;
  flags: string;
  instance_flags: string;
  max_ins?: null;
  instance_location: string;
  hidden: string;
  old_acl_backup?: null;
  resp?: (null)[] | null;
  assistant?: (null)[] | null;
  rights?: null;
  template_resp?: (TemplateRespEntity)[] | null;
  allow_register: number;
  date_ins: string;
  student_registered: number;
  student_grade: string;
  student_credits: number;
  color: string;
  student_flags: string;
  current_resp: boolean;
  activites?: (ActivitesEntity)[] | null;
}
export interface TemplateRespEntity {
  type: string;
  login: string;
  title: string;
  picture: string;
}
export interface ActivitesEntity {
  codeacti: string;
  call_ihk: string;
  slug?: string | null;
  instance_location: string;
  module_title: string;
  title: string;
  description: string;
  type_title: string;
  type_code: string;
  begin: string;
  start: string;
  end_register?: string | null;
  deadline?: string | null;
  end: string;
  nb_hours?: string | null;
  nb_group: number;
  num: number;
  register: string;
  register_by_bloc: string;
  register_prof: string;
  title_location_type?: null;
  is_projet: boolean;
  id_projet?: string | null;
  project_title?: string | null;
  is_note: boolean;
  nb_notes?: number | null;
  is_blocins: boolean;
  rdv_status: string;
  id_bareme?: null;
  title_bareme?: null;
  archive: string;
  hash_elearning?: null;
  ged_node_adm?: string | null;
  nb_planified?: number | null;
  hidden: boolean;
  project?: Project | null;
  events?: (EventsEntity | null)[] | null;
}
export interface Project {
  id: number;
  scolaryear: string;
  codemodule: string;
  codeinstance: string;
  title: string;
}
export interface EventsEntity {
  code: string;
  num_event: string;
  seats: string;
  title?: null;
  description?: null;
  nb_inscrits: string;
  begin: string;
  end: string;
  id_activite: string;
  location: string;
  nb_max_students_projet?: string | null;
  already_register?: null;
  user_status?: null;
  allow_token: string;
  assistants?: (null)[] | null;
}
