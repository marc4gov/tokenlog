import { Namespace } from './Namespace';

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
  readme_url: string;
  _links: GitlabProjectLinks;
  owner: Namespace;
  created: Date;
  updated: Date;
  url: string;
  homepage: string;
  stargazersCount: number;
  forksCount: number;
  openIssueCount: number;
}

export interface GitlabGroup {
  id: number;
  name: string;
  path: string;
  description: string;
  created: Date;
  url: string;
  parent_id: number;
}

export interface ProjectRepo {
  group: number;
  project: number;
}
