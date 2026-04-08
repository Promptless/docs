import { useState } from 'react';
import DocsDebtQuiz from './DocsDebtQuiz';
import DocsDebtModal from './DocsDebtModal';

export default function DocsDebtQuizWithDebug() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          sessionStorage.removeItem('pl_docs_debt_modal_dismissed');
          setShowModal(true);
        }}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 0.85rem',
          border: '1px dashed #d4d4d4',
          borderRadius: '0.4rem',
          background: '#fafafa',
          color: '#737373',
          fontSize: '0.8rem',
          cursor: 'pointer',
        }}
      >
        Debug: Show idle modal
      </button>
      <DocsDebtQuiz />
      {showModal && <DocsDebtModal forceShow />}
    </>
  );
}
