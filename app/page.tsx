"use client";

import {
  ArrowDown,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Lightbulb,
  PenLine,
  RotateCcw,
  Sparkles,
  Wand2
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildLocalFeedback,
  normalizeWritingType,
  type Feedback,
  type FeedbackItem,
  type WritingType
} from "@/lib/feedback";

type AutosavedWriting = {
  writingType?: unknown;
  text?: string;
  revisedText?: string;
  updatedAt?: string;
};

const writingTypes: Array<{
  id: WritingType;
  label: string;
  hint: string;
  starter: string;
}> = [
  {
    id: "story",
    label: "이야기",
    hint: "겪은 일을 장면과 마음으로 써요.",
    starter: "어느 날 있었던 일이나 오늘 가장 기억에 남는 일을 써 보세요."
  },
  {
    id: "opinion",
    label: "주장하는 글",
    hint: "생각과 까닭을 또렷하게 연결해요.",
    starter: "나는 ... 해야 한다고 생각한다. 왜냐하면..."
  },
  {
    id: "explain",
    label: "설명하는 글",
    hint: "정보를 알기 쉽게 차근차근 알려 줘요.",
    starter: "소개하거나 관찰하거나 안내할 내용을 한 문장으로 써 보세요."
  },
  {
    id: "response",
    label: "감상문",
    hint: "기억에 남는 장면과 느낀 점을 써요.",
    starter: "가장 기억에 남는 장면은... 그 까닭은..."
  },
  {
    id: "travel",
    label: "기행문",
    hint: "간 곳, 본 것, 느낀 점을 함께 담아요.",
    starter: "처음 도착한 곳은... 그곳에서 본 것은..."
  },
  {
    id: "letter",
    label: "편지",
    hint: "받는 사람에게 마음을 자연스럽게 전해요.",
    starter: "받는 사람에게 첫인사를 하고, 전하고 싶은 말을 이어 써 보세요."
  }
];

const autosaveKey = "writing-coach-autosave";

const writingHelpers: Record<WritingType, { start: string; reason: string; finish: string }> = {
  explain: {
    start: "제가 소개할 것은 ...입니다.",
    reason: "이것을 설명하려는 까닭은 ...이기 때문입니다.",
    finish: "이렇게 보면 ...을 더 잘 알 수 있습니다."
  },
  opinion: {
    start: "저는 ...해야 한다고 생각합니다.",
    reason: "왜냐하면 ... 때문입니다.",
    finish: "그래서 저는 ...하는 것이 좋다고 생각합니다."
  },
  story: {
    start: "어느 날, ...에서 ... 일이 있었습니다.",
    reason: "그때 저는 ...한 마음이 들었습니다.",
    finish: "이 일을 통해 저는 ...을 알게 되었습니다."
  },
  response: {
    start: "제가 가장 기억에 남는 장면은 ...입니다.",
    reason: "그 장면이 기억에 남은 까닭은 ...입니다.",
    finish: "이 작품을 보고 저는 ...을 느꼈습니다."
  },
  travel: {
    start: "처음 도착한 곳은 ...입니다.",
    reason: "그곳에서 가장 인상 깊었던 것은 ...입니다.",
    finish: "이번 경험을 통해 저는 ...을 느꼈습니다."
  },
  letter: {
    start: "...에게. 안녕하세요?",
    reason: "제가 이 편지를 쓰는 까닭은 ...입니다.",
    finish: "그럼 다음에 또 이야기할게요. ... 올림."
  }
};

function loadAutosavedWriting(): AutosavedWriting | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return JSON.parse(window.localStorage.getItem(autosaveKey) ?? "null") as AutosavedWriting | null;
  } catch {
    return null;
  }
}

function FeedbackList({ items }: { items: FeedbackItem[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <article key={item.title} className="rounded-md border border-slate-200 bg-white p-4 md:p-5">
          <h3 className="text-base font-black leading-6 text-ink">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700 md:text-base md:leading-7">{item.detail}</p>
          <p className="mt-3 rounded-md bg-skywash px-3 py-2 text-sm font-bold leading-6 text-slate-800 md:text-base md:leading-7">
            {item.example}
          </p>
        </article>
      ))}
    </div>
  );
}

function QuestionList({ questions }: { questions: string[] }) {
  return (
    <div className="grid gap-2">
      {questions.map((question) => (
        <div
          key={question}
          className="flex gap-2 rounded-md bg-[#fff3df] p-3 text-sm font-black leading-6 text-slate-800 md:p-4 md:text-base md:leading-7"
        >
          <ChevronRight className="mt-1 shrink-0 text-coral" size={16} aria-hidden="true" />
          <span>{question}</span>
        </div>
      ))}
    </div>
  );
}

function getFocusItem(feedback: Feedback): FeedbackItem {
  return (
    feedback.focus ?? feedback.typeSpecific?.[0] ?? feedback.expression?.[0] ?? feedback.spelling?.[0] ?? {
      title: "먼저 고칠 곳 찾기",
      detail: "글의 목적이 잘 드러나는지 한 번 더 읽어 보세요.",
      example: "가장 말하고 싶은 내용을 첫부분이나 끝부분에 분명히 써 보세요."
    }
  );
}

function getPolishItem(feedback: Feedback): FeedbackItem {
  return (
    feedback.polish ?? feedback.expression?.[0] ?? feedback.typeSpecific?.[1] ?? feedback.spelling?.[0] ?? {
      title: "표현을 더 구체적으로 만들기",
      detail: "읽는 사람이 장면이나 생각을 떠올릴 수 있도록 자세한 말을 보태 보세요.",
      example: "좋았다 -> 친구와 함께해서 마음이 따뜻했다."
    }
  );
}

export default function Home() {
  const [writingType, setWritingType] = useState<WritingType>("story");
  const [text, setText] = useState("");
  const [revisedText, setRevisedText] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState("");
  const [writingHint, setWritingHint] = useState("");
  const [showMoreFeedback, setShowMoreFeedback] = useState(false);
  const [coachingFlash, setCoachingFlash] = useState(false);
  const [hasAutosavedWriting, setHasAutosavedWriting] = useState(false);
  const editorSectionRef = useRef<HTMLElement | null>(null);
  const coachingSectionRef = useRef<HTMLElement | null>(null);

  const selectedType = useMemo(
    () => writingTypes.find((type) => type.id === writingType) ?? writingTypes[0],
    [writingType]
  );

  const wordCount = useMemo(
    () => text.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean).length,
    [text]
  );

  useEffect(() => {
    const autosaved = loadAutosavedWriting();
    setHasAutosavedWriting(Boolean(autosaved?.text?.trim() || autosaved?.revisedText?.trim()));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (text.trim() || revisedText.trim()) {
      window.localStorage.setItem(
        autosaveKey,
        JSON.stringify({
          writingType,
          text,
          revisedText: feedback ? text : revisedText,
          updatedAt: new Date().toISOString()
        } satisfies AutosavedWriting)
      );
      setHasAutosavedWriting(true);
    }
  }, [writingType, text, revisedText, feedback]);

  function checkWriting() {
    setMessage("");
    setIsChecking(true);

    const cleanText = text.trim();
    if (cleanText.length < 20) {
      setMessage("글을 조금 더 작성한 뒤 코칭을 받아 보세요.");
      setIsChecking(false);
      return;
    }

    setFeedback(buildLocalFeedback(cleanText, writingType));
    setRevisedText(cleanText);
    setShowMoreFeedback(false);
    setCoachingFlash(true);
    window.setTimeout(() => setCoachingFlash(false), 1200);
    window.setTimeout(() => {
      coachingSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    setIsChecking(false);
  }

  function restoreAutosavedWriting() {
    const autosaved = loadAutosavedWriting();

    if (!autosaved) {
      setHasAutosavedWriting(false);
      return;
    }

    setWritingType(normalizeWritingType(autosaved.writingType));
    setText(autosaved.text ?? "");
    setRevisedText(autosaved.revisedText ?? "");
    setFeedback(null);
    setWritingHint("");
    setShowMoreFeedback(false);
    setMessage("쓰던 글을 불러왔어요.");
    window.setTimeout(() => editorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function resetWriting() {
    if ((text.trim() || revisedText.trim()) && !window.confirm("쓴 글을 모두 지울까요?")) {
      return;
    }

    setText("");
    setRevisedText("");
    setFeedback(null);
    setWritingHint("");
    setShowMoreFeedback(false);
    setMessage("");
    window.localStorage.removeItem(autosaveKey);
    setHasAutosavedWriting(false);
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-ink">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:py-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-black text-leaf">
              <Sparkles size={18} aria-hidden="true" />
              AI 글코치
            </div>
            <h1 className="mt-1 text-xl font-black tracking-normal text-ink sm:text-2xl">초등 글쓰기 코칭 홈</h1>
          </div>
          <button
            type="button"
            onClick={() => editorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-black text-white hover:bg-slate-700"
          >
            <PenLine size={17} aria-hidden="true" />
            글쓰기
          </button>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-10">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md bg-[#edf8f0] px-3 py-2 text-sm font-black text-leaf">
              <Wand2 size={16} aria-hidden="true" />
              쓰고, 질문받고, 한 문장씩 고쳐요
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-black leading-tight tracking-normal text-ink md:text-5xl">
              글쓰기가 막힐 때 바로 옆에서 도와주는 AI 글코치
            </h2>
            <p className="mt-4 max-w-xl text-base font-bold leading-8 text-slate-600 md:text-lg">
              이야기, 주장하는 글, 설명하는 글을 고르고 초안을 쓰면 목적에 맞는 질문과 고칠 점을 보여줍니다.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => editorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-leaf px-6 text-base font-black text-white hover:bg-emerald-700"
              >
                지금 쓰기
                <ArrowDown size={18} aria-hidden="true" />
              </button>
              {hasAutosavedWriting ? (
                <button
                  type="button"
                  onClick={restoreAutosavedWriting}
                  className="inline-flex h-14 items-center justify-center rounded-md border border-slate-300 bg-white px-6 text-base font-black text-slate-800 hover:border-leaf"
                >
                  쓰던 글 이어서
                </button>
              ) : null}
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-[#fffaf1] p-4 shadow-panel md:p-5">
            <div className="flex items-center gap-2 text-base font-black text-slate-800">
              <ClipboardCheck size={20} className="text-coral" aria-hidden="true" />
              오늘의 코칭 흐름
            </div>
            <div className="mt-4 grid gap-3">
              {["글 유형 고르기", "초안 쓰기", "질문으로 고치기"].map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-md bg-white p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-ink text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <span className="text-base font-black text-slate-800">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-5 sm:px-6 md:py-6">
        <section ref={editorSectionRef} className="rounded-md border border-slate-200 bg-white p-4 md:p-5">
          <div className="mb-3 flex items-center gap-2 text-base font-black text-slate-700">
            <BookOpen size={20} className="text-leaf" aria-hidden="true" />
            어떤 글을 쓸까요?
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {writingTypes.map((type) => {
              const selected = type.id === writingType;

              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setWritingType(type.id);
                    setFeedback(null);
                    setWritingHint("");
                    setShowMoreFeedback(false);
                  }}
                  className={`min-h-24 rounded-md border px-4 py-3 text-left transition ${
                    selected
                      ? "border-leaf bg-[#edf8f0] text-ink ring-2 ring-leaf/20"
                      : "border-slate-200 bg-white text-slate-700 hover:border-leaf"
                  }`}
                >
                  <span className="flex items-center justify-between gap-2 text-lg font-black">
                    {type.label}
                    {selected ? <CheckCircle2 size={20} aria-hidden="true" /> : null}
                  </span>
                  <span className="mt-1 block text-sm font-bold leading-6 text-slate-600">{type.hint}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-md border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-start sm:justify-between md:p-5">
            <div>
              <div className="text-sm font-black text-leaf">1. 글쓰기</div>
              <h2 className="mt-1 text-2xl font-black text-ink">초안을 편하게 써요</h2>
              <p className="mt-1 text-base font-bold leading-7 text-slate-600">{selectedType.starter}</p>
            </div>
            <div className="flex min-h-12 items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-base font-black text-slate-700">
              <FileText size={18} aria-hidden="true" />
              {wordCount} 낱말
            </div>
          </div>

          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 md:px-5">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <span className="flex min-h-12 items-center gap-1 text-base font-black text-slate-700">
                <Lightbulb size={18} className="text-coral" aria-hidden="true" />
                도움 문장
              </span>
              <button
                type="button"
                onClick={() => setWritingHint(writingHelpers[writingType].start)}
                className="h-12 rounded-md border border-slate-300 bg-white px-4 text-base font-black text-slate-700 hover:border-leaf"
              >
                시작
              </button>
              <button
                type="button"
                onClick={() => setWritingHint(writingHelpers[writingType].reason)}
                className="h-12 rounded-md border border-slate-300 bg-white px-4 text-base font-black text-slate-700 hover:border-leaf"
              >
                까닭
              </button>
              <button
                type="button"
                onClick={() => setWritingHint(writingHelpers[writingType].finish)}
                className="h-12 rounded-md border border-slate-300 bg-white px-4 text-base font-black text-slate-700 hover:border-leaf"
              >
                마무리
              </button>
            </div>
            {writingHint ? (
              <p className="mt-3 rounded-md bg-white px-4 py-3 text-lg font-black leading-8 text-ink">
                {writingHint}
              </p>
            ) : null}
          </div>

          <textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value);
            }}
            className="min-h-[360px] w-full border-0 bg-white p-5 text-xl leading-10 text-ink outline-none md:min-h-[460px] md:p-6 md:text-[22px] md:leading-[2.7rem]"
            placeholder={feedback ? "도움을 보고 이 글을 바로 고쳐 보세요." : "여기에 글을 써 보세요."}
          />

          <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
            <p className="min-h-6 text-base font-black text-coral">{message}</p>
            <div className="grid grid-cols-2 gap-2 sm:flex md:gap-3">
              <button
                type="button"
                onClick={resetWriting}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 text-base font-black text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw size={18} aria-hidden="true" />
                처음부터
              </button>
              <button
                type="button"
                onClick={checkWriting}
                disabled={isChecking}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-leaf px-6 text-base font-black text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                <PenLine size={18} aria-hidden="true" />
                {isChecking ? "보고 있어요" : feedback ? "다시 코칭" : "코칭 받기"}
              </button>
            </div>
          </div>
        </section>

        {feedback ? (
          <section
            ref={coachingSectionRef}
            className={`rounded-md border bg-white p-4 transition md:p-5 ${
              coachingFlash ? "border-leaf shadow-[0_0_0_4px_rgba(47,143,91,0.18)]" : "border-slate-200"
            }`}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ClipboardCheck size={22} className="text-leaf" aria-hidden="true" />
                <div>
                  <div className="text-sm font-black text-leaf">2. 코칭 결과</div>
                  <h2 className="text-2xl font-black text-ink">하나씩 고쳐요</h2>
                </div>
              </div>
              {coachingFlash ? (
                <span className="rounded-md bg-[#edf8f0] px-3 py-2 text-sm font-black text-leaf">새 코칭</span>
              ) : null}
            </div>

            <div className="grid gap-4">
              <p className="rounded-md bg-slate-50 p-4 text-base font-bold leading-7 text-slate-700">
                {feedback.summary}
              </p>
              <div>
                <h3 className="mb-2 text-lg font-black text-ink">먼저 이것만 고쳐요</h3>
                <FeedbackList items={[getFocusItem(feedback)]} />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-black text-ink">생각 질문</h3>
                <QuestionList questions={feedback.coachingQuestions.slice(0, 1)} />
              </div>
              {showMoreFeedback ? (
                <div>
                  <h3 className="mb-2 text-lg font-black text-ink">더 좋게 만들기</h3>
                  <FeedbackList items={[getPolishItem(feedback)]} />
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => setShowMoreFeedback((current) => !current)}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-base font-black text-slate-700 hover:border-leaf"
              >
                <ChevronDown
                  size={18}
                  className={`transition ${showMoreFeedback ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
                {showMoreFeedback ? "줄이기" : "하나 더 보기"}
              </button>
            </div>
          </section>
        ) : null}

        <p className="text-center text-sm font-bold text-slate-500">글은 이 기기에 자동으로 임시 저장돼요.</p>
      </div>
    </main>
  );
}
