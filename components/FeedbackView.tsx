import dayjs from "dayjs";

interface CategoryScore {
  name: string;
  score: number;
  comment: string;
}

interface Feedback {
  totalScore: number;
  finalAssessment: string;
  strengths: string[];
  areasForImprovement: string[];
  categoryScores: CategoryScore[];
  createdAt: string | Date;
}

interface Interview {
  id: string;
  level: string;
  type: string;
}

type Props = {
  feedback?: Feedback;
  interview?: Interview;
};

const FeedbackView = ({ feedback, interview }: Props) => {
  if (!feedback) {
    return (
      <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl border border-gray-700 text-center">
        <h3 className="text-xl font-semibold mb-3 text-white">Sin evaluación disponible</h3>
        <p className="text-gray-300 mb-4">
          La evaluación estará disponible después de completar tu clase de inglés.
        </p>
        <div className="animate-pulse bg-gray-700 h-40 rounded-lg mb-4"></div>
        <p className="text-sm text-gray-400">
          Completa tu conversación para recibir feedback detallado sobre tu desempeño.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Evaluación de tu clase</h3>
          <div className="flex items-center gap-2">
            <div className="bg-primary-500/20 rounded-full px-3 py-1">
              <span className="text-primary-300 font-bold">{feedback.totalScore}</span>
              <span className="text-sm text-gray-400">/100</span>
            </div>
            <span className="text-sm text-gray-400">
              {dayjs(feedback.createdAt).format("DD MMM, YYYY")}
            </span>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full mb-5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-700 rounded-full"
            style={{ width: `${feedback.totalScore}%` }}
          ></div>
        </div>
        <p className="text-gray-300 leading-relaxed mb-6">{feedback.finalAssessment}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Puntos Fuertes
          </h4>
          <ul className="space-y-2">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-300 mr-2">•</span>
                <span className="text-gray-300 text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Áreas de Mejora
          </h4>
          <ul className="space-y-2">
            {feedback.areasForImprovement.map((area, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-300 mr-2">•</span>
                <span className="text-gray-300 text-sm">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {feedback.categoryScores.map((category, index) => (
          <div key={index} className="bg-gray-900/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-white">{category.name}</h4>
              <div className="bg-primary-500/20 px-2 py-0.5 rounded-full">
                <span className="text-primary-300 font-bold text-sm">{category.score}</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-gray-700 rounded-full mb-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-700 rounded-full"
                style={{ width: `${category.score}%` }}
              ></div>
            </div>
            <p className="text-gray-300 text-sm">{category.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackView; 