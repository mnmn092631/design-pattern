import { GrimpanHistory } from "../GrimpanHistory.js";
import { Grimpan } from "../Grimpan.js";

export abstract class Command {
  abstract execute(): void;
}

export const counter: { [key: string]: number } = {};

export class SaveHistoryCommand extends Command {
  name = "saveHistory";

  constructor(private grimpan: Grimpan) {
    super();
  }

  override execute(): void {
    this.grimpan.history.saveHistory();
  }
}

function countMixin(value: typeof BackCommand, context: ClassDecoratorContext) {
  return class extends value {
    override execute() {
      super.execute();
      if (counter[this.name]) {
        counter[this.name]++;
      } else {
        counter[this.name] = 1;
      }
    }
  };
}
function loggerMixin(
  value: typeof BackCommand,
  context: ClassDecoratorContext,
) {
  return class extends value {
    override execute() {
      console.log(this.name + " 명령을 실행합니다.");
      super.execute();
    }
  };
}

@countMixin
@loggerMixin
export class BackCommand extends Command {
  name = "back";

  constructor(private history: GrimpanHistory) {
    super();
  }
  override execute(): void {
    this.history.undo(); // receiver에게 로직 전송
  }
}

export class ForwardCommand extends Command {
  name = "forward";

  constructor(private history: GrimpanHistory) {
    super();
  }
  override execute(): void {
    this.history.redo();
  }
}

export class PenSelectCommand extends Command {
  name = "penSelect";

  constructor(private grimpan: Grimpan) {
    super();
  }

  override execute(): void {
    this.grimpan.menu.setActiveBtn("pen");
  }
}

export class EraserSelectCommand extends Command {
  name = "eraserSelect";

  constructor(private grimpan: Grimpan) {
    super();
  }

  override execute(): void {
    this.grimpan.menu.setActiveBtn("eraser");
  }
}

export class CircleSelectCommand extends Command {
  name = "circleSelect";

  constructor(private grimpan: Grimpan) {
    super();
  }

  override execute(): void {
    this.grimpan.menu.setActiveBtn("circle");
  }
}

export class RectangleSelectCommand extends Command {
  name = "rectangleSelect";

  constructor(private grimpan: Grimpan) {
    super();
  }

  override execute(): void {
    this.grimpan.menu.setActiveBtn("rectangle");
  }
}

export class PipetteSelectCommand extends Command {
  name = "pipetteSelect";

  constructor(private grimpan: Grimpan) {
    super();
  }

  override execute(): void {
    this.grimpan.menu.setActiveBtn("pipette");
  }
}

export class SaveCommand extends Command {
  name = "save";

  constructor(private grimpan: Grimpan) {
    super();
  }

  override execute(): void {
    this.grimpan.saveStrategy();
  }
}
