// GrimpanMenuBtn.ts
class GrimpanMenuBtn {
  private name: string;
  private type: string;
  private onClick?: () => void;
  private onChange?: () => void;
  private active?: boolean;
  private value?: string | number;

  private constructor(
    name: string,
    type: string,
    onClick?: () => void,
    onChange?: () => void,
    active?: boolean,
    value?: string | number,
  ) {
    this.name = name;
    this.type = type;
    this.onClick = onClick;
    this.onChange = onChange;
    this.active = active;
    this.value = value;
  }

  static Builder = class GrimpanMenuBtnBuilder {
    btn: GrimpanMenuBtn;
    constructor(name: string, type: string) {
      this.btn = new GrimpanMenuBtn(name, type);
    }

    setOnClick(onClick: () => void) {
      this.btn.onClick = onClick;
      return this;
    }
    setOnChange(onChange: () => void) {
      this.btn.onChange = onChange;
      return this;
    }
    setActive(active: boolean) {
      this.btn.active = active;
      return this;
    }
    setValue(value: string | number) {
      this.btn.value = value;
      return this;
    }
    build() {
      return this.btn;
    }
  };
}

// 장점: 필수와 옵셔널을 구분할 수 있음, .build()시에 완성되었음을 알 수 있음
const backBtn = new GrimpanMenuBtn.Builder("뒤로", "back")
  .setOnChange(() => {})
  .setActive(false)
  .build();

// 객체를 생성할 때 중간에 멈췄다가 재개할 수도 있음
const backBtnBuilder = new GrimpanMenuBtn.Builder("뒤로", "back").setOnClick(
  () => {},
);
// 오래 걸리는 작업
backBtnBuilder.setValue("temp").setActive(false).build();
