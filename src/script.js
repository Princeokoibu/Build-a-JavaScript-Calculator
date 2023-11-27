import React from "https://esm.sh/react@18.2.0";
import ReactDOM from "https://esm.sh/react-dom@18.2.0";

const calcData = [
  { id: "clear", value: "AC" },
  { id: "divide", value: "/" },
  { id: "multiply", value: "x" },
  { id: "seven", value: 7 },
  { id: "eight", value: 8 },
  { id: "nine", value: 9 },
  { id: "subtract", value: "-" },
  { id: "four", value: 4 },
  { id: "five", value: 5 },
  { id: "six", value: 6 },
  { id: "add", value: "+" },
  { id: "one", value: 1 },
  { id: "two", value: 2 },
  { id: "three", value: 3 },
  { id: "equals", value: "=" },
  { id: "zero", value: 0 },
  { id: "decimal", value: "." }
];

const Calculator = () => {
  const [input, setInput] = React.useState("0");
  const [output, setOutput] = React.useState("0");
  const [calculated, setCalculated] = React.useState(false);

  function isNumber(input) {
    return /^[+-]?\d+(\.\d+)?$/.test(input);
  }

  function hasDot(input) {
    return input.includes(".");
  }

  function replaceXWithMultiply(expression) {
    return expression.replace(/x/g, "*");
  }

  function removeLastChar(inputString) {
    if (inputString.length === 0) {
      return inputString;
    }
    return inputString.slice(0, -1);
  }

  function getLastChar(inputString, num) {
    if (inputString.length === 0) {
      return null;
    }

    return inputString[inputString.length - num];
  }

  const handleInput = (value) => {
    // Ensure the input value is a string
    value = value.toString();

    console.log(
      value,
      isNumber(value),
      "current input",
      input,
      isNumber(input),
      "current output",
      output,
      isNumber(output)
    );

    // Initialize variables for updated input and output
    let newInput = input;
    let newOutput = output;

    switch (value) {
      case "AC":
        // Reset input, output, and calculated state
        newInput = "0";
        newOutput = "0";
        setCalculated(false);
        break;
      case "=":
        if (!calculated) {
          const result = eval(replaceXWithMultiply(newOutput));
          newOutput = newOutput + "=" + result;
          newInput = result.toString();
          setCalculated(true);
        }
        break;
      default:
        if (
          (value !== "0" || newInput !== "0") &&
          !(value === "." && hasDot(newInput))
        ) {
          if (newInput === "0") {
            newInput = value;
            newOutput = value;
          } else {
            if (
              (isNumber(newInput) && isNumber(value)) ||
              value === "." ||
              (hasDot(newInput) && isNumber(value))
            ) {
              if (calculated) {
                newInput = value;
                newOutput = value;
              } else {
                newInput = newInput + value;
                newOutput = newOutput + value;
              }
            } else {
              if (calculated) {
                newOutput = newInput + value;
              } else if (
                value !== "-" &&
                getLastChar(newOutput, 1) !== "-" &&
                !isNumber(getLastChar(newOutput, 1)) &&
                !isNumber(value)
              ) {
                console.log("masuk-", getLastChar(newInput, 1));

                newOutput = removeLastChar(output) + value;
              } else if (
                getLastChar(newOutput, 1) === "-" &&
                !isNumber(getLastChar(newOutput, 2)) &&
                !isNumber(value)
              ) {
                newOutput = removeLastChar(removeLastChar(output)) + value;
              } else {
                newOutput = newOutput + value;
              }
              newInput = value;
            }
            if (calculated) {
              setCalculated(false);
            }
          }
        }
    }

    // Update the state with new input and output values
    setInput(newInput);
    setOutput(newOutput);
  };

  return (
    <div
      className="rounded rounded-3 bg-dark text-light shadow py-4 px-3"
      style={{ width: "350px" }}
    >
      <Display input={input} output={output} />
      <Keyboard handleInput={handleInput} />
    </div>
  );
};

const Display = ({ input, output }) => {
  return (
    <div
      className="border border-2 border-secondary bg-light px-2 py-0 d-flex flex-column justify-content-around align-items-end font-monospace mx-2 rounded rounded-3"
      style={{ height: "80px" }}
    >
      <span className="text-secondary h3 p-0 m-0">{output}</span>
      <span id="display" className="text-dark h2 p-0 m-0">
        {input}
      </span>
    </div>
  );
};

const Keyboard = ({ handleInput }) => {
  return (
    <div className="keys">
      {calcData.map((data, index) => (
        <Key data={data} handleInput={handleInput} />
      ))}
    </div>
  );
};

const Key = ({ data, handleInput }) => {
  return (
    <button
      className="py-3 rounded rounded-pill h5"
      id={data.id}
      onClick={() => handleInput(data.value)}
    >
      {data.value}
    </button>
  );
};

const App = () => {
  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center">
      <Calculator />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
