export interface GithubRepo {
  full_name: string;
  description: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  languages_url: string;
  owner: {
    created_at: string;
  };
  created_at: string;
  updated_at: string;
}