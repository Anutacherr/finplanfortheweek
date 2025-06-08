export interface User {
    id: number;
    username: string;
    role: 'admin' | 'judge' | 'organizer';
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    // role: 'judge' | 'organizer';
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Competition {
    id: number;
    name: string;
    date: string;
    location: string;
    status: 'planned' | 'in_progress' | 'completed';
    created_at: string;
}

export interface GymnastsTableProps {
    gymnasts: Gymnast[];
    ageCategories?: AgeCategory[];
    competitionId: number;
    onEdit?: (gymnast: Gymnast) => void;
    onDelete?: (gymnastId: number) => void;
    onUpdate?: () => void;
}


export interface AgeCategory {
    id: number;
    name: string;
    min_birth_year: number;
    max_birth_year: number;
    description?: string;
    apparatuses?: string[];   // Добавляем список предметов
}

export interface Gymnast {
    id: number;
    name: string;
    birth_year: number;
    city?: string;
    coach?: string;
    category?: string;
    age_category_id?: number;
    club?: string;
    created_at: string;
    apparatuses?: string[];
}

export interface Judge {
    id: number;
    name: string;
    created_at: string;
}

export interface Stream {
    id: number;
    competition_id: number;
    age_category_id: number;
    stream_number: number;
    name?: string;
    max_gymnasts?: number;
    competition_day_id?: number;
    scheduled_start: string;
    estimated_duration?: string | { hours: number };
    actual_start?: string;
    actual_end?: string;
}

export interface Performance {
    id: number;
    gymnast_id: number;
    competition_id: number;
    apparatus: 'hoop' | 'ball' | 'clubs' | 'ribbon' | 'rope';
    created_at: string;
    stream_id?: number;
}

export interface Score {
    id: number;
    performance_id: number;
    judge_id: number;
    role_id: number;
    gymnast_id: number;
    competition_id: number;
    apparatus: string;
    score: number;
    created_at: string;
  }

export interface Result {
    id: number;
    gymnast_id: number;
    competition_id: number;
    total_score: number | string;  // может быть числом или строкой
    rank: number;
    a_score: number | string;
    e_score: number | string;
    da_score: number | string;
    db_score?: number | string;
    penalties?: number | string;
    created_at: string;
    gymnast_name?: string;  // добавлено, так как приходит с сервера
}

export interface StreamsTableProps {
    streams: Stream[];
    ageCategories: AgeCategory[];
    onEdit?: (stream: Stream) => void;
    onDelete?: (streamId: number) => void;
}

export interface ResultsTableProps {
    results: Result[];
    gymnasts: Gymnast[];
}

export interface AgeCategoriesManagerProps {
    ageCategories: AgeCategory[];
    setAgeCategories: React.Dispatch<React.SetStateAction<AgeCategory[]>>;
    competitionId: number;
}

export interface ExtendedStream extends Stream {
    gymnasts?: (Gymnast & { apparatuses: string[] })[];
}

export interface Judge {
    id: number;
    name: string;
    role: JudgeRole;
  }

  export interface JudgesTableProps {
    judges: Judge[];
    competitionId: number;
    onUpdate: () => void;
  }
  export type JudgeRole = 'A1' |'A2' |'A3' |'A4' | 'E1' |'E2' |'E3' |'E4' | 'DA1' |'DA2' | 'DB1' |'DB2' | 'линейный судья' | 'хронометрист' | 'главный судья' | 'администратор';
  
  
  