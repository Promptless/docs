import { useState } from 'react';

interface QuizOption {
  label: string;
  score: number;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

interface QuizResult {
  range: [number, number];
  title: string;
  summary: string;
  tips: string[];
}

const questions: QuizQuestion[] = [
  {
    question: 'How many people work on your product?',
    options: [
      { label: 'Just me', score: 1 },
      { label: '2\u20134 people', score: 2 },
      { label: '5\u201310 people', score: 3 },
      { label: '10+', score: 4 },
    ],
  },
  {
    question: 'How often do you ship product updates?',
    options: [
      { label: 'Weekly or more', score: 4 },
      { label: 'Every 2 weeks', score: 3 },
      { label: 'Monthly', score: 2 },
      { label: 'Seldom', score: 1 },
    ],
  },
  {
    question: 'When was the last time someone reviewed your docs end-to-end?',
    options: [
      { label: 'This month', score: 1 },
      { label: 'This quarter', score: 2 },
      { label: 'This year', score: 3 },
      { label: 'I honestly don\u2019t know', score: 4 },
    ],
  },
  {
    question: 'How do you find out about broken or outdated docs?',
    options: [
      { label: 'Automated tests or monitoring', score: 1 },
      { label: 'Regular manual reviews', score: 2 },
      { label: 'When a customer complains', score: 3 },
      { label: 'Usually by accident', score: 4 },
    ],
  },
  {
    question: 'How confident are you that your docs match the current product?',
    options: [
      { label: 'Very confident', score: 1 },
      { label: 'Mostly confident', score: 2 },
      { label: 'Not very confident', score: 3 },
      { label: 'I\u2019d rather not check', score: 4 },
    ],
  },
  {
    question: 'Who is responsible for keeping docs up to date?',
    options: [
      { label: 'A dedicated docs team or tech writer', score: 1 },
      { label: 'Developers update docs alongside code', score: 2 },
      { label: 'It\u2019s supposed to be everyone, but nobody really owns it', score: 3 },
      { label: 'Nobody, specifically', score: 4 },
    ],
  },
  {
    question: 'How many pages of documentation do you have?',
    options: [
      { label: 'Under 20', score: 1 },
      { label: '20\u2013100', score: 2 },
      { label: '100\u2013500', score: 3 },
      { label: '500+', score: 4 },
    ],
  },
];

const results: QuizResult[] = [
  {
    range: [7, 12],
    title: 'Low docs debt',
    summary:
      'Your documentation seems to be in good shape. You have processes in place and a manageable scope. Keep it up!',
    tips: [
      'Set up automated broken link checks to catch issues early.',
      'Schedule a quarterly docs review to stay ahead of drift.',
    ],
  },
  {
    range: [13, 18],
    title: 'Moderate docs debt',
    summary:
      'There are some cracks starting to show. Things are mostly working, but a few gaps could snowball as your product grows.',
    tips: [
      'Audit your highest-traffic pages for accuracy first.',
      'Add docs updates to your shipping checklist for each release.',
      'Consider assigning an owner for docs quality.',
    ],
  },
  {
    range: [19, 23],
    title: 'Significant docs debt',
    summary:
      'Your docs are falling behind your product. Customers are likely running into outdated or missing information regularly.',
    tips: [
      'Prioritize a docs audit on your top 20 most-visited pages.',
      'Tie docs updates to your release process so new features ship with current docs.',
      'Look into automation tools to detect docs drift before customers do.',
    ],
  },
  {
    range: [24, 28],
    title: 'Critical docs debt',
    summary:
      'Your documentation needs urgent attention. At this level, outdated docs are likely causing support tickets, slowing onboarding, and hurting trust.',
    tips: [
      'Start with a broken link audit to find the worst offenders.',
      'Assign a dedicated owner or team to tackle the backlog.',
      'Invest in tooling that keeps docs in sync with your codebase automatically.',
    ],
  },
];

function getResult(score: number): QuizResult {
  for (const r of results) {
    if (score >= r.range[0] && score <= r.range[1]) return r;
  }
  return results[results.length - 1];
}

export default function DocsDebtQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => new Array(questions.length).fill(null),
  );
  const [showResult, setShowResult] = useState(false);

  const progress = showResult
    ? 100
    : ((currentQuestion + 1) / (questions.length + 1)) * 100;

  const handleSelect = (score: number) => {
    const next = [...answers];
    next[currentQuestion] = score;
    setAnswers(next);

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
    }, 200);
  };

  const handleBack = () => {
    if (showResult) {
      setShowResult(false);
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(null));
    setShowResult(false);
  };

  const totalScore = answers.reduce<number>((sum, a) => sum + (a ?? 0), 0);
  const result = getResult(totalScore);

  const q = questions[currentQuestion];

  return (
    <div className="pl-quiz-backdrop">
      <div className="pl-quiz-container">
        <div className="pl-quiz-card">
          {/* Progress bar */}
          <div className="pl-quiz-progress-track">
            <div
              className="pl-quiz-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Header */}
          <div className="pl-quiz-header">
            <a href="/" className="pl-quiz-logo">
              <img
                alt=""
                src="/favicon.ico"
                className="pl-quiz-logo-img"
                width={18}
                height={18}
              />
              <span className="pl-quiz-logo-text">Promptless</span>
            </a>
            {!showResult && currentQuestion > 0 && (
              <button
                className="pl-quiz-back"
                onClick={handleBack}
                aria-label="Back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                >
                  <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" />
                </svg>
                <span>Back</span>
              </button>
            )}
          </div>

          {/* Body */}
          {!showResult ? (
            <div className="pl-quiz-body">
              <h2 className="pl-quiz-question">{q.question}</h2>
              <div className="pl-quiz-options">
                {q.options.map((opt) => (
                  <button
                    key={opt.label}
                    className={`pl-quiz-option ${answers[currentQuestion] === opt.score ? 'is-selected' : ''}`}
                    onClick={() => handleSelect(opt.score)}
                  >
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pl-quiz-body">
              <div className="pl-quiz-result-badge" data-level={result.title}>
                Score: {totalScore} / {questions.length * 4}
              </div>
              <h2 className="pl-quiz-question">{result.title}</h2>
              <p className="pl-quiz-result-summary">{result.summary}</p>
              <div className="pl-quiz-result-tips">
                <h3>What to do next</h3>
                <ul>
                  {result.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
              <div className="pl-quiz-result-actions">
                <button className="pl-quiz-restart" onClick={handleRestart}>
                  Retake quiz
                </button>
                <a className="pl-quiz-cta" href="/free-tools/broken-link-report">
                  Run a free broken link report
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
