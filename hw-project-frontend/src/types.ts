export interface Country {
  id: string;
  name: string;
  avg_income: string;
  bm_price: string;
  nr_monthly_bm: string;
  emoticon_code: string | null;
}

export interface Player {
  id: number;
  name: string;
  color: string;
}

export interface RaceResult {
  id: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  type: string;
}
