import { useState, useCallback } from "react";
import { useRoom } from "@/context/RoomContext";
import { Play } from "lucide-react";

interface TestResult {
  id: string;
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
}

export default function CodeWorkbench() {
  const { currentRoom, updateTestResults } = useRoom();
  const [code, setCode] = useState(currentRoom?.problems[0]?.starterCode || "");
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeProblemIdx] = useState(0);

  const problem = currentRoom?.problems[activeProblemIdx];

  const runCode = useCallback(() => {
    if (!problem) return;
    setIsRunning(true);
    setConsoleOutput([]);
    setTestResults([]);

    setTimeout(() => {
      const logs: string[] = [];
      const results: TestResult[] = [];

      try {
        // Simple evaluation sandbox
        const fn = new Function(
          "console",
          code + `\nreturn typeof ${problem.starterCode.match(/function\s+(\w+)/)?.[1]} !== 'undefined' ? ${problem.starterCode.match(/function\s+(\w+)/)?.[1]} : null;`
        );

        const mockConsole = {
          log: (...args: unknown[]) => logs.push(args.map(String).join(" ")),
          error: (...args: unknown[]) => logs.push("ERROR: " + args.map(String).join(" ")),
          warn: (...args: unknown[]) => logs.push("WARN: " + args.map(String).join(" ")),
        };

        const userFn = fn(mockConsole);

        if (!userFn) {
          logs.push("Error: Function not found. Make sure your function is defined.");
        } else {
          problem.testCases.forEach((tc, i) => {
            try {
              // Parse input - simple approach
              const args = tc.input.split("\n").map((line) => {
                try {
                  return JSON.parse(line);
                } catch {
                  return line;
                }
              });
              const result = userFn(...args);
              const resultStr = JSON.stringify(result) ?? String(result);
              const passed = resultStr === tc.expectedOutput;
              results.push({
                id: tc.id,
                passed,
                input: tc.input,
                expected: tc.expectedOutput,
                actual: resultStr,
              });
              logs.push(`Test ${i + 1}: ${passed ? "PASSED ✓" : "FAILED ✗"} | Expected: ${tc.expectedOutput} | Got: ${resultStr}`);
            } catch (err) {
              results.push({
                id: tc.id,
                passed: false,
                input: tc.input,
                expected: tc.expectedOutput,
                actual: String(err),
              });
              logs.push(`Test ${i + 1}: ERROR - ${err}`);
            }
          });
        }
      } catch (err) {
        logs.push(`Compilation Error: ${err}`);
      }

      setConsoleOutput(logs);
      setTestResults(results);

      const passed = results.filter((r) => r.passed).length;
      const total = results.length;
      updateTestResults(passed, total);

      setIsRunning(false);
    }, 300);
  }, [code, problem, updateTestResults]);

  if (!problem) return null;

  const passedCount = testResults.filter((r) => r.passed).length;

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs text-muted-foreground font-mono">{problem.title}</span>
        <button
          onClick={runCode}
          disabled={isRunning}
          className="flex items-center gap-1.5 rounded bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <Play className="h-3 w-3" />
          {isRunning ? "Running..." : "Run"}
        </button>
      </div>

      {/* Code editor */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="code-editor h-full w-full p-4"
          spellCheck={false}
        />
      </div>

      {/* Console output */}
      <div className="border-t border-border" style={{ height: "35%" }}>
        <div className="flex items-center justify-between border-b border-border px-4 py-1.5">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Console
          </span>
          {testResults.length > 0 && (
            <span className={`text-[10px] font-mono ${passedCount === testResults.length ? "text-success" : "text-destructive"}`}>
              {passedCount}/{testResults.length} passed
            </span>
          )}
        </div>
        <div className="h-full overflow-y-auto p-3 font-mono text-xs">
          {consoleOutput.length === 0 ? (
            <span className="text-muted-foreground">Run your code to see output</span>
          ) : (
            consoleOutput.map((line, i) => (
              <div
                key={i}
                className={`py-0.5 ${
                  line.includes("PASSED") ? "text-success" : line.includes("FAILED") || line.includes("ERROR") || line.includes("Error") ? "text-destructive" : "text-foreground"
                }`}
              >
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
