import { Component } from "./base-component";
import { Validatable, validate } from "../utils/validation";
import { autobind } from "../decorators/autobind";
import { projectState } from "../state/project-state";

// ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  inputTitle: HTMLInputElement;
  inputDescription: HTMLInputElement;
  inputPeople: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.inputTitle = <HTMLInputElement>this.element.querySelector("#title")!;
    this.inputDescription = <HTMLInputElement>(
      this.element.querySelector("#description")!
    );
    this.inputPeople = <HTMLInputElement>this.element.querySelector("#people")!;

    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent(): void {}

  private getUserInput(): [string, string, number] | void {
    const title = this.inputTitle.value;
    const description = this.inputDescription.value;
    const people = this.inputPeople.value;

    const titleValidatable: Validatable = {
      value: title,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: description,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +people,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input, please try again!");
      return;
    } else {
      return [title, description, +people];
    }
  }

  private clearInputs() {
    this.inputTitle.value = "";
    this.inputDescription.value = "";
    this.inputPeople.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.getUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }
}
