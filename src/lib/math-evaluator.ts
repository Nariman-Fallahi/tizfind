export interface MathEvaluation {
  isMath: boolean;
  expression: string;
  result: string | null;
}

export function analyzeMathInput(rawInput: string): MathEvaluation {
  const cleaned = rawInput.trim();

  if (!cleaned) {
    return { isMath: false, expression: cleaned, result: null };
  }

  const hasNumber = /\d/.test(cleaned);
  if (!hasNumber) {
    return { isMath: false, expression: cleaned, result: null };
  }

  const mathAllowedRegex = /^[\d\s+\-*/().^%a-zA-Z]+$/;
  if (!mathAllowedRegex.test(cleaned)) {
    return { isMath: false, expression: cleaned, result: null };
  }

  const isActualMath = /[+\-*/^%]|\b(sin|cos|tan|sqrt|log|ln)\s*\([\d]/i.test(
    cleaned,
  );

  const hasMathStructure =
    isActualMath || /[\d]+\s*[\+\-\*\/\^]\s*[\d]+/.test(cleaned);

  if (!hasMathStructure) {
    return { isMath: false, expression: cleaned, result: null };
  }

  const result = calculateSafe(cleaned);

  return {
    isMath: result !== null,
    expression: cleaned,
    result,
  };
}

export function calculateSafe(expr: string): string | null {
  try {
    let normalized = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/\^/g, "**")
      .replace(/π/g, "Math.PI")
      .replace(/e/g, "Math.E")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g, "Math.log(")
      .replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

    const openParens = (normalized.match(/\(/g) || []).length;
    const closeParens = (normalized.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      normalized += ")".repeat(openParens - closeParens);
    }

    if (!normalized.trim() || /[+\-*/.(]$/.test(normalized.trim())) {
      return null;
    }

    const evaluator = new Function(`"use strict"; return (${normalized});`);
    const output: number = evaluator();

    if (
      typeof output !== "number" ||
      Number.isNaN(output) ||
      !Number.isFinite(output)
    ) {
      return null;
    }

    return Number(output.toFixed(10)).toString();
  } catch {
    return null;
  }
}
