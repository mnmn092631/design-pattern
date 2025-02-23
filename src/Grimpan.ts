import {
  AbstractGrimpanFactory,
  ChromeGrimpanFactory,
  IEGrimpanFactory,
} from "./GrimpanFactory.js";
import {
  BtnType,
  ChromeGrimpanMenu,
  GrimpanMenu,
  IEGrimpanMenu,
} from "./GrimpanMenu.js";
import {
  ChromeGrimpanHistory,
  GrimpanHistory,
  IEGrimpanHistory,
} from "./GrimpanHistory.js";
import {
  BackCommand,
  ForwardCommand,
  PenSelectCommand,
} from "./commands/index.js";
import {
  CircleMode,
  EraserMode,
  Mode,
  PenMode,
  PipetteMode,
  RectangleMode,
} from "./modes/index.js";

export interface GrimpanOption {
  menu: BtnType[];
}

export type GrimpanMode = "pen" | "eraser" | "pipette" | "circle" | "rectangle";

export abstract class Grimpan {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  history!: GrimpanHistory;
  menu!: GrimpanMenu;
  mode!: Mode;
  color: string;
  active: boolean;

  protected constructor(
    canvas: HTMLElement | null,
    factory: typeof AbstractGrimpanFactory,
  ) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error("canvas 엘리먼트를 입력하세요");
    }
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d")!;
    this.color = "#000";
    this.active = false;
  }

  setMode(mode: GrimpanMode) {
    switch (mode) {
      case "pen":
        this.mode = new PenMode(this);
        break;
      case "eraser":
        this.mode = new EraserMode(this);
        break;
      case "pipette":
        this.mode = new PipetteMode(this);
        break;
      case "circle":
        this.mode = new CircleMode(this);
        break;
      case "rectangle":
        this.mode = new RectangleMode(this);
        break;
    }
  }

  setColor(color: string) {
    this.color = color;
  }

  changeColor(color: string) {
    this.setColor(color);
    if (this.menu.colorBtn) this.menu.colorBtn.value = color;
  }

  abstract initialize(option: GrimpanOption): void;
  abstract onMousedown(e: MouseEvent): void;
  abstract onMousemove(e: MouseEvent): void;
  abstract onMouseup(e: MouseEvent): void;
  static getInstance() {}
}

export class IEGrimpan extends Grimpan {
  private static instance: IEGrimpan;
  override menu: IEGrimpanMenu;
  override history: IEGrimpanHistory;

  private constructor(
    canvas: HTMLElement | null,
    factory: typeof IEGrimpanFactory,
  ) {
    super(canvas, factory);
    this.menu = factory.createGrimpanMenu(
      this,
      document.querySelector("#menu")!,
    );
    this.history = factory.createGrimpanHistory(this);
  }

  initialize() {}

  override onMousedown() {}
  override onMousemove() {}
  override onMouseup() {}

  static override getInstance() {
    if (!this.instance) {
      this.instance = new IEGrimpan(
        document.querySelector("canvas"),
        IEGrimpanFactory,
      );
    }
    return this.instance;
  }
}

export class ChromeGrimpan extends Grimpan {
  private static instance: ChromeGrimpan;
  override menu: ChromeGrimpanMenu;
  override history: ChromeGrimpanHistory;

  private constructor(
    canvas: HTMLElement | null,
    factory: typeof ChromeGrimpanFactory,
  ) {
    super(canvas, factory);
    this.menu = factory.createGrimpanMenu(
      this,
      document.querySelector("#menu")!,
    );
    this.history = factory.createGrimpanHistory(this);
  }

  initialize(option: GrimpanOption) {
    this.menu.initialize(option.menu);
    this.history.initialize();
    window.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.code === "KeyZ" && e.ctrlKey && e.shiftKey) {
        this.menu.executeCommand(new ForwardCommand(this.history));
        return;
      }
      if (e.code === "KeyZ" && e.ctrlKey) {
        this.menu.executeCommand(new BackCommand(this.history));
        return;
      }
    });
    this.canvas.addEventListener("mousedown", this.onMousedown.bind(this));
    this.canvas.addEventListener("mousemove", this.onMousemove.bind(this));
    this.canvas.addEventListener("mouseup", this.onMouseup.bind(this));
    this.canvas.addEventListener("mouseleave", this.onMouseup.bind(this));
  }

  override onMousedown(e: MouseEvent) {
    this.mode.mousedown(e);
  }
  override onMousemove(e: MouseEvent) {
    this.mode.mousemove(e);
  }
  override onMouseup(e: MouseEvent) {
    this.mode.mouseup(e);
  }

  static override getInstance() {
    if (!this.instance) {
      this.instance = new ChromeGrimpan(
        document.querySelector("canvas"),
        ChromeGrimpanFactory,
      );
    }
    return this.instance;
  }
}
