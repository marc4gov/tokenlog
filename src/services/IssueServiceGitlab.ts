import { Repository, RepositoryType, } from 'types/Repository';
import { GitlabProjectLinks, GitlabProject, GitlabGroup, ProjectRepo} from 'types/RepositoryGitlab';
import { Namespace } from 'types/Namespace';
import { Owner, OwnerType } from 'types/Owner';
import { Label } from 'types/Label';
import { Vote } from 'types/Vote';
import { Issue, IssueState, IssueType } from 'types/Issue';
import { RepositorySettings } from 'types/RepositorySettings';
import VotingService from './VotingService';
import axios from 'axios';
import { AppConfig } from 'config/App';
import { LabelBadges } from 'components/LabelBadges';

export default {
  GetGroups,
  GetProjects,
  GetProjectLabels,
  GetProjectIssues
};

async function GetGroups(
  group_url: string = "https://gitlab.com/api/v4/groups/12046108/subgroups"
): Promise<Array<GitlabGroup>> {
  const result = await axios.get(group_url);
  if (result.status !== 200) throw new Error("Couldn't retrieve public groups");
  return Array.from(result.data)
    .map((i) => toGitlabGroup(i))
    .sort((a, b) => b.id - a.id);
}

async function GetProjects(
  group_url: string = "https://gitlab.com/api/v4/groups/",
  group_id: number = 0,
): Promise<Array<GitlabProject>> {
  const result = await axios.get(group_url + group_id);
  if (result.status !== 200) throw new Error("Couldn't retrieve public projects");

  return Array.from(result.data.projects)
    .map((i) => toGitlabProject(i))
    .sort((a, b) => b.stargazersCount - a.stargazersCount);
}

async function GetProjectLabels(project_id: number): Promise<Array<Label>> {
  const result = await axios.get("https://gitlab.com/api/v4/projects/" + project_id + "/labels?private_token=vJsnvkksdELzxsJR2Pwz");
  if (result.status !== 200) throw new Error("Couldn't retrieve labels");
  return Array.from(result.data)
    .map((i) => toLabel(i))
    .sort((a, b) => b.id - a.id);
}

async function GetProjectIssues(project_id: number = 0): Promise<Array<Issue>> {
  const result = await axios.get("https://gitlab.com/api/v4/projects/" + project_id + "/issues?private_token=vJsnvkksdELzxsJR2Pwz");
  if (result.status !== 200) throw new Error("Couldn't retrieve issues");

  const owner = "";
  const repo = ""
  const votes = await VotingService.GetVotes(owner, repo);

  return Array.from(result.data)
    .map((i) => toIssue(i, votes))
    .sort((a, b) => b.voteCount - a.voteCount);
}

function toGitlabGroup(source: any): GitlabGroup {
  return {
    id: source.id,
    name: source.name,
    path: source.path,
    description: source.description,
    created: new Date(source.created_at),
    url: source.web_url,
    parent_id: source.parent_id
  } as GitlabGroup;
}

function toGitlabProject(source: any): GitlabProject {
  return {
    id: source.id,
    name: source.name,
    path: source.path,
    description: source.description,
    url: source.web_url,
    readme_url: source.readme_url,
    _links: toGitlabProjectLinks(source._links),
    archived: source.archived,
    owner: toNamespace(source.namespace),
    created: new Date(source.created_at),
    updated: new Date(source.last_activity_at),
    homepage: source.readme_url,
    stargazersCount: source.star_count,
    forksCount: source.forks_count,
    openIssueCount: source.open_issues_count,
  } as GitlabProject;
}

function toGitlabProjectLinks(source: any): GitlabProjectLinks {
  return {
    self: source.self,
    issues: source.issues,
    merge_requests: source.merge_requests,
    repo_branches: source.repo_branches,
    labels: source.labels,
    events: source.events,
    members: source.members,
  } as GitlabProjectLinks;
}

function toOwner(source: any): Owner {
  return {
    id: source.id,
    name: source.login,
    username: source.username,
    type: source.username != null ? OwnerType.USER : OwnerType.ORGANIZATION,
    url: source.web_url,
    avatarUrl: source.avatar_url,
  } as Owner;
}

function toNamespace(source: any): Namespace {
  return {
    id: source.id,
    name: source.login,
    kind: source.kind,
    url: source.web_url,
    avatarUrl: source.avatar_url,
    parent_id: source.parent_id
  } as Namespace;
}

function toIssue(source: any, votes: Array<Vote>, gitlab: boolean = false): Issue {
  return {
    id: source.id,
    number: source.iid,
    title: source.title,
    description: source.body,
    state: source.state,
    type: source.pull_request ? IssueType.PR : IssueType.ISSUE,
    labels: Array.from(source.labels).map((i) => toLabel(i)),
    assignees: Array.from(source.assignees).map((i) => toOwner(i)),
    created: new Date(source.created_at),
    updated: new Date(source.updated_at),
    url: source.html_url,
    commentsCount: source.comments,
    votes: votes.filter((i) => i.number === source.number),
    voteCount: votes.filter((i) => i.number === source.number).reduce((a, b) => a + b.amount, 0) ?? 0,
  } as Issue;
}

function toLabel(source: any): Label {
  return {
    id: source.id,
    name: source.name,
    description: source.description,
    color: source.color,
  } as Label;
}

function toGitlabLabel(name: string, labels: Label[]): Label {
  labels.filter((a) => (a.name == name))
  return labels[0] as Label;
}