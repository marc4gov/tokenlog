import { Owner } from './Owner';

export interface GitlabProjectLinks {
  self: string;
  issues: string;
  merge_requests: string;
  repo_branches: string;
  labels: string;
  events: string;
  members: string;
}

export interface GitlabProject {
  id: number;
  name: string;
  path: string;
  description: string;
  created_at: Date;
  web_url: string;
  readme_url: string;
  _links: GitlabProjectLinks;
}

export interface GitlabGroup {
  id: number;
  name: string;
  path: string;
  description: string;
  created_at: Date;
  web_url: string;
  parent_id: number;
  projects: Array<GitlabProject>;
}

export interface ProjectRepo {
  group: number;
  project: number;
}
