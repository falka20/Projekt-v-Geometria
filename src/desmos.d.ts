// desmos.d.ts
//A desmos calculator típus függvényei
declare namespace Desmos {
  interface Calculator {
    //setExpression overload
    setExpression(expression: { id: string; latex: string }): void;
    setExpression(expression: { id: string; latex: string; sliderBounds: { min: string, max: string } }): void;
    setExpression(expression: { id: string; latex: string; color: string }): void;
    setExpression(expression: { id: string; type: string; text: string }): void;

    setBlank(): void;
  }

  interface CalculatorOptions {
    keypad?: boolean;
  }

  function GraphingCalculator(
    element: HTMLElement,
    options?: CalculatorOptions
  ): Calculator;
}
