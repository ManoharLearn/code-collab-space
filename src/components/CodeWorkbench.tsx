import { useState, useCallback } from "react";
import { useRoom } from "@/context/RoomContext";
import { LANGUAGES, type LanguageId } from "@/data/problems";
import { Play, ChevronDown } from "lucide-react";

interface TestResult {
  id: string;
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
}

export default function CodeWorkbench() {
  const { currentRoom, updateTestResults } = useRoom();
  const [language, setLanguage] = useState<LanguageId>("javascript");
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [activeProblemIdx] = useState(0);

  const problem = currentRoom?.problems[activeProblemIdx];
  const codeKey = `${problem?.id}-${language}`;
  const code = codeMap[codeKey] ?? (problem?.starterCode[language] || "");

  const setCode = (val: string) => {
    setCodeMap((prev) => ({ ...prev, [codeKey]: val }));
  };

  const currentLang = LANGUAGES.find((l) => l.id === language)!;

  const runCode = useCallback(() => {
    if (!problem) return;
    setIsRunning(true);
    setConsoleOutput([]);
    setTestResults([]);

    // For JS/TS, run locally. For other languages, show a message about Judge0.
    if (language !== "javascript" && language !== "typescript") {
      setTimeout(() => {
        setConsoleOutput([
          `Running ${currentLang.name} requires a code execution backend.`,
          "",
          "To enable multi-language execution:",
          "1. Self-host Judge0 CE (https://github.com/judge0/judge0)",
          `2. Or use the public API with language ID: ${currentLang.judge0Id}`,
          "",
          "The backend server supports forwarding to Judge0.",
          "Set JUDGE0_URL in your server environment.",
          "",
          "For now, JavaScript execution is available locally.",
        ]);
        setIsRunning(false);
      }, 300);
      return;
    }

    setTimeout(() => {
      const logs: string[] = [];
      const results: TestResult[] = [];

      try {
        const fnNameMatch = problem.starterCode.javascript.match(/function\s+(\w+)/);
        const fnName = fnNameMatch?.[1];

        const fn = new Function(
          "console",
          code + (fnName ? `\nreturn typeof ${fnName} !== 'undefined' ? ${fnName} : null;` : "\nreturn null;")
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
              const args = tc.input.split("\n").map((line) => {
                try { return JSON.parse(line); } catch { return line; }
              });
              const result = userFn(...args);
              const resultStr = JSON.stringify(result) ?? String(result);
              const passed = resultStr === tc.expectedOutput;
              results.push({ id: tc.id, passed, input: tc.input, expected: tc.expectedOutput, actual: resultStr });
              logs.push(`Test ${i + 1}: ${passed ? "PASSED ✓" : "FAILED ✗"} | Expected: ${tc.expectedOutput} | Got: ${resultStr}`);
            } catch (err) {
              results.push({ id: tc.id, passed: false, input: tc.input, expected: tc.expectedOutput, actual: String(err) });
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
      updateTestResults(passed, results.length);
      setIsRunning(false);
    }, 300);
  }, [code, problem, updateTestResults, language, currentLang]);

  if (!problem) return null;

  const passedCount = testResults.filter((r) => r.passed).length;

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono">{problem.title}</span>

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 rounded border border-border bg-background px-2 py-1 text-[11px] font-medium text-foreground hover:bg-muted transition-colors"
            >
              {currentLang.name}
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                <div className="absolute left-0 top-full z-50 mt-1 rounded border border-border bg-surface py-1 shadow-lg min-w-[140px]">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => { setLanguage(lang.id); setShowLangMenu(false); }}
                      className={`w-full px-3 py-1.5 text-left text-xs transition-colors ${
                        lang.id === language ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

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
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Console</span>
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
