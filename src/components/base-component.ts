// Base Class Compponent
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  mainElement: T;
  element: U;

  constructor(
    templateId: string,
    mainElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById(templateId)!
    );
    this.mainElement = <T>document.getElementById(mainElementId)!;

    const nodeContent = document.importNode(this.templateElement.content, true);

    this.element = <U>nodeContent.firstElementChild;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attachSection(insertAtStart);
  }

  private attachSection(whereToInsert: boolean) {
    this.mainElement.insertAdjacentElement(
      whereToInsert ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}
