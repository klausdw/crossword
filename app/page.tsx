"use client";

import { useState, useEffect } from "react";
import CrosswordGrid from "../components/crossword";
import { Button } from "@/components/ui/button";
import { Download, Eye, EyeOff, PlusCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ColorPicker } from "@/components/ui/color-picker";
import { Separator } from "@/components/ui/separator";

const Home = () => {
  const [questions, setQuestions] = useState<string[]>([""]);
  const [answers, setAnswers] = useState<string[]>([""]);
  const [isHorizontal, setIsHorizontal] = useState<boolean[]>([true]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>("#edf2f7");

  const handleQuestionChange = (index: number, value: string) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      updatedQuestions[index] = value;
      return updatedQuestions;
    });
  };

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prev) => {
      const updatedAnswers = [...prev];
      updatedAnswers[index] = value;
      return updatedAnswers;
    });
  };

  const handleOrientationChange = (index: number, checked: boolean) => {
    setIsHorizontal((prev) => {
      const updatedOrientation = [...prev];
      updatedOrientation[index] = checked;
      return updatedOrientation;
    });
  };

  const addQuestionAnswerPair = () => {
    setQuestions((prev) => [...prev, ""]);
    setAnswers((prev) => [...prev, ""]);
    setIsHorizontal((prev) =>
      !!isHorizontal[0] ? [...prev, false] : [...prev, true]
    );
  };

  const deleteQuestionAnswerPair = (index: number) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      updatedQuestions.splice(index, 1);
      return updatedQuestions;
    });

    setAnswers((prev) => {
      const updatedAnswers = [...prev];
      updatedAnswers.splice(index, 1);
      return updatedAnswers;
    });

    setIsHorizontal((prev) => {
      const updatedOrientation = [...prev];
      updatedOrientation.splice(index, 1);
      return updatedOrientation;
    });
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
            @media print {
                body * {
                    visibility: hidden;
                }
                #crossword-content, #crossword-content * {
                    visibility: visible;
                    background: transparent !important; /* Ensure transparency */
                }
                #crossword-content {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    background: transparent !important; /* Transparent background for main container */
                }
            }
        `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const downloadCrossword = () => {
    window.print();
  };

  useEffect(() => {
    const checkAnswers = () => {
      setError(false);
      const nonEmptyAnswers = answers.filter((answer) => answer.trim() !== "");
      if (nonEmptyAnswers.length < 2) {
        setError(false);
        return;
      }

      for (let i = 0; i < nonEmptyAnswers.length; i++) {
        const answerChars = new Set(nonEmptyAnswers[i].toLowerCase());
        let hasMatchingChar = false;

        for (let j = 0; j < nonEmptyAnswers.length; j++) {
          if (i !== j) {
            const otherChars = new Set(nonEmptyAnswers[j].toLowerCase());

            if ([...answerChars].some((char) => otherChars.has(char))) {
              hasMatchingChar = true;
              break;
            }
          }
        }

        if (!hasMatchingChar) {
          setError(true);
          return;
        }
      }
    };

    checkAnswers();
  }, [answers]);

  const handleColorChange = (color: string) => {
    setBgColor(color);
  };

  return (
    <div
      className="min-h-screen bg-[#e8f3e8] p-4 font-serif"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-[#1a3a1a]">
          Kreuzworträtsel erstellen
        </h1>
        <div className="grid gap-4 lg:grid-cols-[1fr,2fr]">
          <div className="w-full border-4 border-double border-[#1a3a1a] bg-white p-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
            <h2 className="mb-4 text-2xl font-semibold text-[#1a3a1a]">
              Fragen & Antworten
            </h2>
            <Separator className="mb-6 bg-[#1a3a1a]" />
            <ScrollArea className="h-[calc(100vh-350px)] border p-4">
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    className="space-y-4 border border-[#1a3a1a]/50 p-4"
                  >
                    <div>
                      <Label className="text-lg" htmlFor={`question-${index}`}>
                        {index + 1}. Frage
                      </Label>
                      <Input
                        type="text"
                        value={question}
                        onChange={(e) =>
                          handleQuestionChange(index, e.target.value)
                        }
                        className="border-2 border-[#1a3a1a]/20 bg-[#e8f3e8] font-serif shadow-inner"
                      />
                      <Label className="text-lg" htmlFor={`question-${index}`}>
                        {index + 1}. Antwort
                      </Label>
                      <Input
                        type="text"
                        value={answers[index]}
                        onChange={(e) =>
                          handleAnswerChange(index, e.target.value)
                        }
                        className={`border-2 bg-[#e8f3e8] font-serif uppercase shadow-inner ${
                          error
                            ? "border border-red-500"
                            : "border-[#1a3a1a]/20"
                        }`}
                      />
                      <div className="grid grid-cols-[1fr,0fr] items-center justify-items-end mt-2">
                        <RadioGroup
                          onValueChange={(value) =>
                            handleOrientationChange(
                              index,
                              value === "horizontal"
                            )
                          }
                          defaultValue={
                            isHorizontal[index] === true
                              ? "horizontal"
                              : "vertical"
                          }
                        >
                          <div className="col-span-2 items-center space-x-2">
                            <RadioGroupItem
                              value="horizontal"
                              id={`horizontal-${index}`}
                              className="border-[#1a3a1a]"
                            />
                            <Label htmlFor={`horizontal-${index}`}>
                              Horizontal
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="vertical"
                              id={`vertical-${index}`}
                              className="border-[#1a3a1a]"
                            />
                            <Label htmlFor={`vertical-${index}`}>
                              Vertical
                            </Label>
                          </div>
                        </RadioGroup>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 border-2 border-[#1a3a1a] hover:bg-red-400 hover:border-red-600"
                          onClick={() => deleteQuestionAnswerPair(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button
              onClick={addQuestionAnswerPair}
              className="mt-6 w-full border-2 border-[#295929] bg-[#1a3a1a] font-serif text-[#e8f3e8] hover:bg-[#1a3a1a]/90 shadow"
            >
              <PlusCircle className="mr-2 h-2 w-2" /> Frage/Antwort erstellen
            </Button>
          </div>
          <div className="border-4 border-double border-[#1a3a1a] bg-white p-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] flex flex-col h-full">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#1a3a1a]">Rätsel</h2>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="border-2 border-[#1a3a1a] font-serif hover:bg-[#e8f3e8] shadow"
                >
                  {showAnswers ? (
                    <>
                      <EyeOff className="h-4 w-4" /> Text ausblenden
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" /> Text anzeigen
                    </>
                  )}
                </Button>
                <ColorPicker value={bgColor} onChange={handleColorChange} />
                <Button
                  onClick={downloadCrossword}
                  className="border-2 border-[#1a3a1a] bg-[#1a3a1a] font-serif text-[#e8f3e8] hover:bg-[#1a3a1a]/90 shadow"
                >
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </div>
            <Separator className="mb-6 bg-[#1a3a1a]" />
            <div className="aspect-square border-2 border-[#1a3a1a] bg-[#e8f3e8] shadow-sm p-4">
              <div
                className="bg-white w-full flex flex-col justify-center"
                id="crossword-content"
              >
                <CrosswordGrid
                  answers={answers}
                  isHorizontal={isHorizontal}
                  showAnswers={showAnswers}
                  backgroundColor={bgColor}
                />
                {questions && questions.length > 1 ? (
                  <div className="text-center">
                    {questions.map((q, index) => (
                      <div className="grid grid-cols-2 px-6" key={index}>
                        <p>
                          {index + 1}. {q}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {answers && answers.length > 1 ? (
                  <div className="flex flex-wrap gap-2 justify-center rotate-180 text-[8px] my-auto w-[500px] mx-auto">
                    <p>Lösungen:</p>
                    {answers.map((q, index) => (
                      <div key={index} className="flex flex-col">
                        <p>
                          {index + 1}. {q}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
