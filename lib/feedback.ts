export type WritingType =
  | "explain"
  | "opinion"
  | "story"
  | "response"
  | "travel"
  | "letter";

export type FeedbackItem = {
  title: string;
  detail: string;
  example: string;
};

export type Feedback = {
  summary: string;
  focus: FeedbackItem;
  polish: FeedbackItem;
  spelling: FeedbackItem[];
  expression: FeedbackItem[];
  typeSpecific: FeedbackItem[];
  coachingQuestions: string[];
};

export type RevisionEvaluation = {
  improved: FeedbackItem[];
  remaining: FeedbackItem[];
  nextQuestion: string;
};

type TypeCheck = {
  missing: boolean;
  focus: FeedbackItem;
  question: string;
};

const typeLabels: Record<WritingType, string> = {
  explain: "설명하는 글",
  opinion: "주장하는 글",
  story: "이야기",
  response: "감상문",
  travel: "기행문",
  letter: "편지"
};

const typeGuides: Record<WritingType, FeedbackItem[]> = {
  explain: [
    {
      title: "설명할 대상이 분명한지 보기",
      detail: "설명하는 글은 소개글, 관찰 기록문, 안내문처럼 무엇을 알려 주려는지 먼저 드러나야 합니다.",
      example: "제가 소개할 것은 우리 학교 도서관입니다."
    },
    {
      title: "특징, 변화, 방법을 나누어 쓰기",
      detail: "대상의 특징, 관찰한 변화, 따라야 할 순서를 나누어 쓰면 읽는 사람이 이해하기 쉽습니다.",
      example: "첫째, 이용 시간입니다. 둘째, 책을 빌리는 방법입니다."
    }
  ],
  opinion: [
    {
      title: "주장이 한 문장으로 드러나는지 보기",
      detail: "주장하는 글은 내가 찬성하는지, 반대하는지, 무엇을 해야 한다고 생각하는지가 분명해야 합니다.",
      example: "저는 쉬는 시간에 복도에서 뛰면 안 된다고 생각합니다."
    },
    {
      title: "까닭과 근거를 붙이기",
      detail: "주장 뒤에는 왜 그렇게 생각하는지 까닭이나 예시가 따라와야 설득력이 생깁니다.",
      example: "왜냐하면 다른 친구와 부딪쳐 다칠 수 있기 때문입니다."
    }
  ],
  story: [
    {
      title: "인물, 사건, 배경이 보이는지 보기",
      detail: "이야기와 일기는 누가, 언제, 어디에서, 어떤 일을 겪었는지가 드러나야 장면이 생생해집니다.",
      example: "점심시간에 민수는 운동장 그네 앞에서 친구를 기다렸습니다."
    },
    {
      title: "마음이나 변화 넣기",
      detail: "겪은 일만 나열하기보다 인물의 마음, 생각, 달라진 점을 넣으면 이야기가 더 살아납니다.",
      example: "처음에는 걱정했지만 친구가 웃어 주자 마음이 놓였습니다."
    }
  ],
  response: [
    {
      title: "감상한 대상 밝히기",
      detail: "감상문은 어떤 책, 영화, 공연, 경험을 보고 느낀 것인지 먼저 알 수 있어야 합니다.",
      example: "저는 '강아지똥'을 읽고 생명의 소중함을 느꼈습니다."
    },
    {
      title: "느낀 점과 까닭 연결하기",
      detail: "재미있었다, 좋았다에서 멈추지 말고 어떤 장면 때문에 그런 마음이 들었는지 써야 합니다.",
      example: "주인공이 친구를 도와주는 장면을 보고 나도 용기를 내고 싶었습니다."
    }
  ],
  travel: [
    {
      title: "다녀온 곳과 이동 순서가 보이는지 보기",
      detail: "기행문은 어디에 갔는지, 어떤 순서로 이동했는지가 드러나면 읽는 사람이 따라가기 쉽습니다.",
      example: "먼저 박물관에 갔고, 다음에는 바닷가 산책로를 걸었습니다."
    },
    {
      title: "본 것과 느낀 점 함께 쓰기",
      detail: "장소 이름만 나열하지 말고 본 것, 들은 것, 냄새, 분위기, 느낀 점을 함께 써 보세요.",
      example: "전시장 안은 조용했고 오래된 배 모형을 보니 옛사람들의 생활이 궁금해졌습니다."
    }
  ],
  letter: [
    {
      title: "편지의 기본 형식 갖추기",
      detail: "편지는 받는 사람, 첫 인사, 전하고 싶은 말, 끝인사, 쓴 날짜, 쓴 사람이 잘 드러나야 합니다. 추신은 꼭 필요한 경우에만 덧붙입니다.",
      example: "할머니께. 안녕하세요? ... 그럼 다음에 또 편지드릴게요. 2026년 5월 26일, 민수 올림."
    },
    {
      title: "받는 사람에게 맞는 말투 쓰기",
      detail: "친구, 가족, 선생님처럼 받는 사람에 따라 인사와 끝맺는 말을 자연스럽게 골라야 합니다.",
      example: "선생님께는 '감사합니다', 친구에게는 '또 만나자'처럼 어울리는 말을 써 보세요."
    }
  ]
};

const datePattern =
  /(\d{4}\s*년\s*\d{1,2}\s*월\s*\d{1,2}\s*일|\d{1,2}\s*월\s*\d{1,2}\s*일|\d{4}[./-]\d{1,2}[./-]\d{1,2})/;

function splitSentences(text: string) {
  return text
    .split(/(?<=[.!?。！？])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function hasOpinionClaim(text: string) {
  return (
    includesAny(text, [
      "생각합니다",
      "생각한다",
      "생각해요",
      "주장합니다",
      "주장한다",
      "찬성",
      "반대",
      "해야",
      "하면 안",
      "안 됩니다",
      "안 된다",
      "안 돼",
      "좋습니다",
      "좋다",
      "필요합니다",
      "필요하다",
      "중요합니다",
      "중요하다",
      "바랍니다",
      "원합니다"
    ]) || /(해야|하면\s*안|안\s*된|좋다고|나쁘다고|필요하다고|중요하다고)/.test(text)
  );
}

function hasEnoughContent(text: string, minLength = 70) {
  return text.replace(/\s+/g, "").length >= minLength;
}

function wordCount(text: string) {
  return text.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean).length;
}

function repeatedWords(text: string) {
  const counts = text
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 2)
    .reduce<Record<string, number>>((acc, word) => {
      acc[word] = (acc[word] ?? 0) + 1;
      return acc;
    }, {});

  return Object.entries(counts)
    .filter(([, count]) => count >= 3)
    .map(([word]) => word)
    .slice(0, 4);
}

function makeCheck(missing: boolean, focus: FeedbackItem, question: string): TypeCheck {
  return { missing, focus, question };
}

function findTypeChecks(text: string, writingType: WritingType): TypeCheck[] {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const firstLine = lines[0] ?? "";
  const lastLines = lines.slice(-3).join(" ");

  if (writingType === "explain") {
    return [
      makeCheck(
        !hasEnoughContent(firstLine, 12),
        {
          title: "무엇을 설명할지 먼저 써요",
          detail: "첫 문장에서 설명할 것을 알려 주세요.",
          example: "제가 소개할 것은 우리 학교 도서관입니다."
        },
        "무엇을 설명하는 글인가요?"
      ),
      makeCheck(
        !includesAny(text, ["첫째", "둘째", "먼저", "다음", "마지막", "특징", "방법", "순서", "변화"]),
        {
          title: "내용을 나누어 써요",
          detail: "첫째, 둘째처럼 나누면 읽기 쉬워요.",
          example: "첫째, 생김새입니다. 둘째, 자라는 모습입니다."
        },
        "첫째, 둘째로 나누면 무엇을 쓸 수 있나요?"
      )
    ];
  }

  if (writingType === "opinion") {
    return [
      makeCheck(
        !hasOpinionClaim(text),
        {
          title: "내 생각을 한 문장으로 써요",
          detail: "찬성인지 반대인지 바로 보이게 써 주세요.",
          example: "저는 쉬는 시간에 복도에서 뛰면 안 된다고 생각합니다."
        },
        "내 생각을 한 문장으로 말하면 무엇인가요?"
      ),
      makeCheck(
        !includesAny(text, ["왜냐하면", "까닭", "이유", "때문", "예를 들어"]),
        {
          title: "까닭을 붙여요",
          detail: "왜 그렇게 생각하는지 한 문장 더 써요.",
          example: "왜냐하면 다른 친구와 부딪쳐 다칠 수 있기 때문입니다."
        },
        "왜 그렇게 생각하나요?"
      )
    ];
  }

  if (writingType === "story") {
    return [
      makeCheck(
        !includesAny(text, ["오늘", "어느 날", "아침", "점심", "저녁", "학교", "집", "친구"]),
        {
          title: "언제, 어디인지 써요",
          detail: "이야기가 시작된 곳을 알려 주세요.",
          example: "점심시간에 민수는 운동장 그네 앞에서 친구를 기다렸습니다."
        },
        "이 일은 언제, 어디에서 있었나요?"
      ),
      makeCheck(
        !includesAny(text, ["기뻤", "슬펐", "무서웠", "걱정", "뿌듯", "놀랐", "생각", "마음"]),
        {
          title: "마음을 써요",
          detail: "그때 어떤 마음이었는지 넣어 보세요.",
          example: "처음에는 걱정했지만 친구가 웃어 주자 마음이 놓였습니다."
        },
        "그때 어떤 마음이 들었나요?"
      )
    ];
  }

  if (writingType === "response") {
    return [
      makeCheck(
        !includesAny(text, ["읽고", "보고", "들은", "책", "영화", "공연", "작품", "장면"]),
        {
          title: "무엇을 보았는지 써요",
          detail: "책, 영화, 경험 이름을 먼저 알려 주세요.",
          example: "저는 '강아지똥'을 읽고 생명의 소중함을 느꼈습니다."
        },
        "무엇을 보고 쓴 글인가요?"
      ),
      makeCheck(
        !includesAny(text, ["느꼈", "생각", "마음", "인상", "기억", "왜냐하면", "때문"]),
        {
          title: "왜 그렇게 느꼈는지 써요",
          detail: "좋았던 장면을 하나 골라 써 보세요.",
          example: "주인공이 친구를 도와주는 장면을 보고 나도 용기를 내고 싶었습니다."
        },
        "가장 기억에 남는 장면은 무엇인가요?"
      )
    ];
  }

  if (writingType === "travel") {
    return [
      makeCheck(
        !includesAny(text, ["갔", "다녀", "도착", "출발", "먼저", "다음", "마지막"]),
        {
          title: "어디에 갔는지 써요",
          detail: "간 곳과 순서를 알려 주세요.",
          example: "먼저 박물관에 갔고, 다음에는 바닷가 산책로를 걸었습니다."
        },
        "먼저 어디에 갔나요?"
      ),
      makeCheck(
        !includesAny(text, ["보았", "들었", "냄새", "느낌", "분위기", "신기", "아름", "맛"]),
        {
          title: "보고 느낀 것을 써요",
          detail: "본 것과 마음을 함께 써 보세요.",
          example: "전시장 안은 조용했고 오래된 배 모형을 보니 옛사람들의 생활이 궁금해졌습니다."
        },
        "가장 기억나는 것은 무엇인가요?"
      )
    ];
  }

  const hasRecipient = /(께|에게|한테|보아라|에게 쓰는 편지)/.test(firstLine) || /(께|에게|한테)\s*[,.。]?/.test(text);
  const hasGreeting = includesAny(text, ["안녕", "안녕하세요", "잘 지내", "그동안", "오랜만", "반가워"]);
  const hasMessage = hasEnoughContent(text.replace(datePattern, ""), 45);
  const hasClosing = includesAny(lastLines, ["그럼", "이만", "안녕", "건강", "답장", "또 쓸게", "사랑해", "감사합니다"]);
  const hasDate = datePattern.test(text);
  const hasSender = /(올림|드림|씀|가|이가|으로부터|보냄)/.test(lastLines);

  return [
    makeCheck(
      !hasRecipient,
      {
        title: "받는 사람을 써요",
        detail: "누구에게 쓰는 편지인지 먼저 써요.",
        example: "할머니께 / 지우에게"
      },
      "누구에게 쓰는 편지인가요?"
    ),
    makeCheck(
      !hasGreeting,
      {
        title: "첫 인사를 써요",
        detail: "처음에 인사말을 넣어 보세요.",
        example: "안녕하세요? 잘 지내고 계신가요?"
      },
      "어떤 인사말로 시작할까요?"
    ),
    makeCheck(
      !hasMessage,
      {
        title: "전하고 싶은 말을 더 써요",
        detail: "왜 편지를 쓰는지 한 문장 더 써요.",
        example: "지난번에 도와주셔서 감사했습니다. 덕분에 발표를 끝까지 할 수 있었습니다."
      },
      "무슨 말을 더 전하고 싶나요?"
    ),
    makeCheck(
      !hasClosing,
      {
        title: "끝인사가 필요해요",
        detail: "마지막에 안부나 다음 만남을 떠올리는 끝인사를 넣어 보세요.",
        example: "그럼 건강히 지내세요. 다음에 또 편지드릴게요."
      },
      "편지를 마무리하는 말로 어떤 안부나 약속을 전하면 좋을까요?"
    ),
    makeCheck(
      !hasDate,
      {
        title: "쓴 날짜가 빠져 있어요",
        detail: "편지 끝부분에 쓴 날짜를 적으면 편지 형식이 갖추어집니다.",
        example: "2026년 5월 26일"
      },
      "이 편지를 쓴 날짜는 어떻게 적으면 좋을까요?"
    ),
    makeCheck(
      !hasSender,
      {
        title: "쓴 사람이 빠져 있어요",
        detail: "누가 쓴 편지인지 알 수 있도록 끝부분에 이름을 적어 주세요.",
        example: "민수 올림 / 지우가"
      },
      "누가 쓴 편지인지 끝부분에 어떻게 적을까요?"
    )
  ];
}

function missingChecks(text: string, writingType: WritingType) {
  return findTypeChecks(text, writingType).filter((check) => check.missing);
}

export function normalizeWritingType(value: unknown): WritingType {
  if (
    value === "explain" ||
    value === "opinion" ||
    value === "story" ||
    value === "response" ||
    value === "travel" ||
    value === "letter"
  ) {
    return value;
  }

  if (value === "observation") {
    return "explain";
  }

  if (value === "diary") {
    return "story";
  }

  return "explain";
}

export function buildLocalFeedback(text: string, writingType: WritingType): Feedback {
  const sentences = splitSentences(text);
  const repeated = repeatedWords(text);
  const expressionItems: FeedbackItem[] = [];

  if (text.length < 120) {
    expressionItems.push({
      title: "한 문장 더 써요",
      detail: "글이 아직 조금 짧아요.",
      example: "누가, 언제, 어디서 중 하나를 골라 더 써 보세요."
    });
  }

  if (sentences.some((sentence) => sentence.length > 80)) {
    expressionItems.push({
      title: "긴 문장을 나누어요",
      detail: "한 문장이 너무 길면 읽기 어려워요.",
      example: "그리고, 그래서, 그런데 앞에서 문장을 한 번 끊어 보세요."
    });
  }

  if (repeated.length > 0) {
    expressionItems.push({
      title: "같은 말을 바꾸어요",
      detail: `"${repeated.join(", ")}" 말이 여러 번 나와요.`,
      example: "좋았다 -> 즐거웠다, 뿌듯했다, 신기했다, 마음에 남았다"
    });
  }

  if (!/[.!?。！？]$/.test(text.trim())) {
    expressionItems.push({
      title: "마침표를 확인해요",
      detail: "마지막 문장 끝을 확인해 주세요.",
      example: "문장 끝에 . ? ! 중 어울리는 것을 붙여 보세요."
    });
  }

  if (expressionItems.length === 0) {
    expressionItems.push({
      title: "자세한 말을 넣어요",
      detail: "색깔, 표정, 소리 같은 말을 넣으면 좋아요.",
      example: "꽃이 피었다 -> 노란 꽃이 바람에 살짝 흔들렸다."
    });
  }

  const missing = missingChecks(text, writingType).slice(0, 2);
  const focus =
    missing[0]?.focus ??
    expressionItems[0] ?? {
      title: "중심 생각은 보여요",
      detail: "이제 읽는 사람이 더 잘 떠올리도록 자세한 말을 하나 넣어 보세요.",
      example: "왜 그렇게 생각했는지, 어떤 일이 있었는지 한 문장 더 써 보세요."
    };
  const polish = expressionItems[0] ?? typeGuides[writingType][1] ?? typeGuides[writingType][0];
  const coachingQuestions = Array.from(
    new Set([
      writingType === "letter" ? "받는 사람이 어떤 마음이면 좋을까요?" : "가장 말하고 싶은 것은 무엇인가요?",
      ...missing.map((check) => check.question)
    ])
  );

  return {
    summary: `${typeLabels[writingType]}로 잘 시작했어요. 먼저 한 가지만 고쳐 볼게요.`,
    focus,
    polish,
    spelling: [
      {
        title: "띄어쓰기와 문장 부호 다시 읽기",
        detail: "자동으로 정답을 고치기보다 소리 내어 읽으며 어색하게 이어지는 곳을 찾아보세요.",
        example: "문장이 끝나는 곳마다 잠깐 쉬어 읽히는지 확인해 보세요."
      }
    ],
    expression: expressionItems,
    typeSpecific: typeGuides[writingType],
    coachingQuestions
  };
}

export function evaluateRevision(originalText: string, revisedText: string, writingType: WritingType): RevisionEvaluation {
  const original = originalText.trim();
  const revised = revisedText.trim();
  const originalWordCount = wordCount(original);
  const revisedWordCount = wordCount(revised);
  const originalRepeats = repeatedWords(original);
  const revisedRepeats = repeatedWords(revised);
  const originalMissing = missingChecks(original, writingType);
  const revisedMissing = missingChecks(revised, writingType);
  const improved: FeedbackItem[] = [];
  const remaining: FeedbackItem[] = [];

  if (revisedWordCount > originalWordCount) {
    improved.push({
      title: "내용을 더 썼어요",
      detail: "처음 글보다 생각이나 장면이 늘었어요.",
      example: "잘했어요. 이제 한 문장만 더 다듬어 보세요."
    });
  }

  if (revisedRepeats.length < originalRepeats.length) {
    improved.push({
      title: "같은 말이 줄었어요",
      detail: "비슷한 말을 바꾸어 글이 더 좋아졌어요.",
      example: "좋았다 -> 즐거웠다, 뿌듯했다"
    });
  }

  const fixedCount = Math.max(0, originalMissing.length - revisedMissing.length);
  if (fixedCount > 0) {
    improved.push({
      title: "필요한 말을 보탰어요",
      detail: `${typeLabels[writingType]}에 어울리는 말이 더 들어갔어요.`,
      example: "이 부분은 잘 고쳤어요."
    });
  }

  if (improved.length === 0) {
    improved.push({
      title: "다시 읽고 썼어요",
      detail: "처음 글을 다시 본 점이 좋아요.",
      example: "이제 한 곳만 더 고쳐 보세요."
    });
  }

  if (revisedWordCount <= originalWordCount) {
    remaining.push({
      title: "한 문장 더 써요",
      detail: "까닭, 장면, 마음 중 하나를 더 넣어 보세요.",
      example: "왜? 어디서? 어떤 마음? 중 하나를 골라요."
    });
  }

  if (revisedRepeats.length > 0) {
    remaining.push({
      title: "같은 말을 바꾸어요",
      detail: `"${revisedRepeats.join(", ")}" 말이 여러 번 나와요.`,
      example: "재미있었다 -> 웃음이 났다"
    });
  }

  if (revisedMissing.length > 0) {
    remaining.push(revisedMissing[0].focus);
  }

  if (remaining.length === 0) {
    remaining.push({
      title: "마지막으로 읽어 봐요",
      detail: "문장 끝과 어색한 말을 확인해요.",
      example: "소리 내어 한 번 읽어 보세요."
    });
  }

  const nextQuestion =
    revisedMissing[0]?.question ??
    (revisedWordCount <= originalWordCount
      ? "어디에 한 문장을 더 넣을까요?"
      : "가장 좋아진 문장은 무엇인가요?");

  return {
    improved: improved.slice(0, 2),
    remaining: remaining.slice(0, 2),
    nextQuestion
  };
}
