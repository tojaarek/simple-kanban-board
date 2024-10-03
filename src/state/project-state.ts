import { Project, ProjectStatus } from "../models/project-model";

// State management
type Listener<T> = (items: T[]) => void;

export class initialState<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFunction: Listener<T>) {
    this.listeners.push(listenerFunction);
  }
}

export class State extends initialState<Project> {
  private projects: Project[] = [];
  private static instance: State;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new State();
    return this.instance;
  }

  addProject(title: string, description: string, numberOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numberOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  changeProjectStatus(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((project) => project.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFunction of this.listeners) {
      listenerFunction(this.projects.slice());
    }
  }
}

export const projectState = State.getInstance();
