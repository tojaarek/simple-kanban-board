import { Component } from "./base-component";
import { autobind } from "../decorators/autobind";
import { projectState } from "../state/project-state";
import { ProjectItem } from "./project-item";
import { Project, ProjectStatus } from "../models/project-model";
import { DragTarget } from "../models/drag-drop";

// ProjectList Class
export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  private renderProjects() {
    const listElement = <HTMLUListElement>(
      document.getElementById(`${this.type}-project-list`)
    );
    listElement.innerHTML = "";
    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
    }
  }

  @autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @autobind
  dragLeaveHandler(_: DragEvent): void {
    const listElement = this.element.querySelector("ul")!;
    listElement.classList.remove("droppable");
  }

  @autobind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData("text/plain");
    projectState.changeProjectStatus(
      projectId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
    const listElement = this.element.querySelector("ul")!;
    listElement.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    projectState.addListener((projects: Project[]) => {
      const filterprojects = projects.filter((project) => {
        if (this.type === "active") {
          return project.status === ProjectStatus.Active;
        }
        return project.status === ProjectStatus.Finished;
      });
      this.assignedProjects = filterprojects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }
}
