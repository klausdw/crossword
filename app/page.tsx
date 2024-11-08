"use client";

import { useState, useEffect } from "react";
import CrosswordGrid from "../components/crossword";
import { Button } from "@/components/ui/button";
import {
  Download,
  Eye,
  EyeOff,
  PaintBucket,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Home = () => {
  const [questions, setQuestions] = useState<string[]>([""]);
  const [answers, setAnswers] = useState<string[]>([""]);
  const [isHorizontal, setIsHorizontal] = useState<boolean[]>([true]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [error, setError] = useState<boolean>(false);

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Kreuzworträtsel erstellen</h1>
      <div className="grid lg:grid-cols-[1fr,2fr] gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-6">Fragen/Antworten</h2>
          <ScrollArea className="h-[calc(100vh-240px)] border rounded-md p-4">
            <Button
              onClick={addQuestionAnswerPair}
              className="sticky top-0 z-10 w-full bg-lime-600 hover:bg-lime-900"
            >
              <PlusCircle className="mr-2 h-2 w-2" /> Frage/Antwort erstellen
            </Button>
            <div className="space-y-4  flex flex-col-reverse">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="space-y-2 p-4 bg-gray-50 rounded-lg relative"
                >
                  <div className="flex flex-col gap-2">
                    <Input
                      type="text"
                      value={question}
                      onChange={(e) =>
                        handleQuestionChange(index, e.target.value)
                      }
                      className="border p-1 text-black"
                      placeholder={`${index + 1}. Frage`}
                    />
                    <Input
                      type="text"
                      value={answers[index]}
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                      className={`p-1 text-black ${
                        error ? "border border-red-500" : "border"
                      }`}
                      placeholder={`${index + 1}. Antwort`}
                    />
                    <div className="flex items-center">
                      <RadioGroup
                        onValueChange={(value) =>
                          handleOrientationChange(index, value === "horizontal")
                        }
                        defaultValue={
                          isHorizontal[index] === true
                            ? "horizontal"
                            : "vertical"
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="horizontal"
                            id={`horizontal-${index}`}
                          />
                          <Label
                            htmlFor={`horizontal-${index}`}
                            className="ml-2"
                          >
                            Horizontal
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="vertical"
                            id={`vertical-${index}`}
                          />
                          <Label htmlFor={`vertical-${index}`} className="ml-2">
                            Vertical
                          </Label>
                        </div>
                      </RadioGroup>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto border border-gray-400"
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
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Rätsel</h2>
            <Button
              onClick={() => setShowAnswers(!showAnswers)}
              className="w-1/3 bg-lime-600 hover:bg-lime-900"
            >
              {showAnswers ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" /> Text ausblenden
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" /> Text anzeigen
                </>
              )}
            </Button>
            <Button
              onClick={downloadCrossword}
              className="w-1/3 bg-lime-600 hover:bg-lime-900"
            >
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
          <div className="bg-white border rounded-lg shadow-sm p-4">
            <div
              className="bg-white w-full flex flex-col justify-center"
              id="crossword-content"
            >
              <CrosswordGrid
                answers={answers}
                isHorizontal={isHorizontal}
                showAnswers={showAnswers}
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
  );
};

export default Home;
