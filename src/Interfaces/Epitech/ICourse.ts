export interface ICourse {
  id: number;
  title_cn?: string | null;
  semester: number;
  num: string;
  begin?: string | null;
  end?: string | null;
  end_register?: string | null;
  scolaryear: number;
  code: string;
  codeinstance: string;
  location_title: string;
  instance_location: string;
  flags: string;
  credits: string;
  rights?: (null)[] | null;
  status: string;
  waiting_grades?: null;
  active_promo: string;
  open: string;
  title: string;
}
