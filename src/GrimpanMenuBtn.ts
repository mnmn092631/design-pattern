import { BtnType, GrimpanMenu } from "./GrimpanMenu.js";

abstract class GrimpanMenuElementBuilder {
  btn!: GrimpanMenuElement;
  constructor() {}
  build() {
    return this.btn;
  }
}

export abstract class GrimpanMenuElement {
  protected menu: GrimpanMenu;
  protected name: string;
  protected type: BtnType;

  protected constructor(menu: GrimpanMenu, name: string, type: BtnType) {
    this.menu = menu;
    this.name = name;
    this.type = type;
  }

  // 템플릿이 됨
  draw() {
    const btn = this.createButton();
    this.appendBeforeBtn();
    this.appendToDom(btn);
    this.appendAfterBtn();
  }

  abstract createButton(): HTMLElement;
  abstract appendBeforeBtn(): void;
  abstract appendToDom(btn: HTMLElement): void;
  abstract appendAfterBtn(): void;
}

export class GrimpanMenuInput extends GrimpanMenuElement {
  private onChange?: (e: Event) => void;
  private value?: string | number;

  private constructor(
    menu: GrimpanMenu,
    name: string,
    type: BtnType,
    onChange?: () => void,
    value?: string | number,
  ) {
    super(menu, name, type);
    this.onChange = onChange;
    this.value = value;
  }
  createButton(): HTMLInputElement {
    const btn = document.createElement("input");
    btn.type = "color";
    btn.title = this.name;
    btn.id = "color-btn";
    if (this.onChange) btn.addEventListener("change", this.onChange.bind(this));
    return btn;
  }

  appendToDom(btn: HTMLInputElement) {
    this.menu.colorBtn = btn;
    this.menu.dom.append(btn);
  }

  appendBeforeBtn() {
    // 자식 로직
  }

  appendAfterBtn() {
    // 자식 로직
  }

  static Builder = class GrimpanMenuInputBuilder extends GrimpanMenuElementBuilder {
    override btn: GrimpanMenuInput;
    constructor(menu: GrimpanMenu, name: string, type: BtnType) {
      super();
      this.btn = new GrimpanMenuInput(menu, name, type);
    }
    setOnChange(onChange: (e: Event) => void) {
      this.btn.onChange = onChange;
      return this;
    }
    setValue(value: string | number) {
      this.btn.value = value;
      return this;
    }
  };
}

export class GrimpanMenuBtn extends GrimpanMenuElement {
  protected onClick?: () => void;
  protected active?: boolean;

  protected constructor(
    menu: GrimpanMenu,
    name: string,
    type: BtnType,
    onClick?: () => void,
    active?: boolean,
  ) {
    super(menu, name, type);
    this.onClick = onClick;
    this.active = active;
  }

  createButton(): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.textContent = this.name;
    btn.id = `${this.type}-btn`;
    if (this.onClick) btn.addEventListener("click", this.onClick.bind(this));
    return btn;
  }

  appendToDom(btn: HTMLButtonElement) {
    this.menu.dom.append(btn);
  }

  appendBeforeBtn() {
    // 자식 로직
  }

  appendAfterBtn() {
    // 자식 로직
  }

  static Builder = class GrimpanMenuBtnBuilder extends GrimpanMenuElementBuilder {
    override btn: GrimpanMenuBtn;
    constructor(menu: GrimpanMenu, name: string, type: BtnType) {
      super();
      this.btn = new GrimpanMenuBtn(menu, name, type);
    }
    setOnClick(onClick: () => void) {
      this.btn.onClick = onClick;
      return this;
    }
    setActive(active: boolean) {
      this.btn.active = active;
      return this;
    }
  };
}

export class GrimpanMenuSaveBtn extends GrimpanMenuBtn {
  private onClickBlur!: (e: Event) => void;
  private onClickInvert!: (e: Event) => void;
  private onClickGrayScale!: (e: Event) => void;

  private constructor(
    menu: GrimpanMenu,
    name: string,
    type: BtnType,
    onClick?: () => void,
    active?: boolean,
  ) {
    super(menu, name, type);
    this.onClick = onClick;
    this.active = active;
  }

  override appendBeforeBtn() {
    this.drawInput("블러", this.onClickBlur);
    this.drawInput("반전", this.onClickInvert);
    this.drawInput("흑백", this.onClickGrayScale);
  }

  drawInput(title: string, onChange: (e: Event) => void) {
    const input = document.createElement("input") as HTMLInputElement;
    input.type = "checkbox";
    input.title = title;
    input.addEventListener("change", onChange.bind(this));
    this.menu.dom.append(input);
  }

  static override Builder = class GrimpanMenuSaveBtnBuilder extends GrimpanMenuElementBuilder {
    override btn: GrimpanMenuSaveBtn;
    constructor(menu: GrimpanMenu, name: string, type: BtnType) {
      super();
      this.btn = new GrimpanMenuSaveBtn(menu, name, type);
    }

    setFilterListeners(listeners: {
      [key in "blur" | "invert" | "grayscale"]: (e: Event) => void;
    }) {
      this.btn.onClickBlur = listeners.blur;
      this.btn.onClickInvert = listeners.invert;
      this.btn.onClickGrayScale = listeners.grayscale;
      return this;
    }
    setOnClick(onClick: () => void) {
      this.btn.onClick = onClick;
      return this;
    }
    setActive(active: boolean) {
      this.btn.active = active;
      return this;
    }
  };
}
