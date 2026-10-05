import { useState } from "react";
import { useParams } from "react-router-dom";
import useBookEditor from "../hooks/useBookEditor";
import useNotebookPrefs from "../hooks/useNotebookPrefs";
import PageList from "../components/BookEditor/PageList";
import EditorToolbar from "../components/BookEditor/EditorToolbar";
import Paper from "../components/BookEditor/Paper";
import PrintMulti from "../components/BookEditor/PrintMulti";
import "../components/BookEditor/Editor.css";

export default function BookEditor() {
  const { bookId } = useParams();
  const ed = useBookEditor(bookId);
  const [globalPrefs, setGlobalPref] = useNotebookPrefs();
  const activePrefs = ed.prefs || globalPrefs;
  const [printRange, setPrintRange] = useState(null);
  const active = ed.pages.find((p) => p.id === ed.activeId);

  const handlePrint = async (id) => {
    if (id !== ed.activeId) {
      await ed.openPage(id);
      setTimeout(() => window.print(), 200);
    } else {
      window.print();
    }
  };

  const removePage = (id) => {
    if (window.confirm("Delete this page? It will move to Trash.")) ed.deletePage(id);
  };

  const goToNextPage = async () => {
    const currentIndex = ed.pages.findIndex(p => p.id === ed.activeId);
    if (currentIndex >= 0 && currentIndex < ed.pages.length - 1) {
      await ed.openPage(ed.pages[currentIndex + 1].id);
    } else {
      await ed.addPage();
    }
  };

  return (
    <div className="ed" data-printing={!!printRange}>
      <PageList book={ed.book} pages={ed.pages} activeId={ed.activeId} onOpen={ed.openPage} onAdd={ed.addPage} onRename={ed.renamePage} onPrint={handlePrint} onDelete={removePage} onPrintRange={(from, to) => setPrintRange({from, to})} />

      <main className="ed-main">
        {ed.error && <p className="ed-error" role="alert">{ed.error}</p>}

        {ed.loading ? (
          <p className="ed-msg">Opening notebook...</p>
        ) : !ed.activeId ? (
          <div className="ed-empty">
            <h2>This notebook has no pages yet</h2>
            <p>Add the first page and start writing.</p>
            <button type="button" onClick={ed.addPage}>Write the first page</button>
          </div>
        ) : (
          <>
            <EditorToolbar prefs={activePrefs} onPref={(k, v) => {
              setGlobalPref(k, v);
              ed.editPrefs({ ...activePrefs, [k]: v });
            }} status={ed.status} />
            <Paper
              key={ed.activeId}
              prefs={activePrefs}
              pageNumber={active?.page_number}
              title={ed.title}
              onTitle={ed.editTitle}
              blocks={ed.blocks}
              onBlockChange={ed.updateBlock}
              onBlockDelete={ed.removeBlock}
              onBlockMove={ed.moveBlock}
              onAddBlock={ed.addBlock}
              onNext={goToNextPage}
            />
            {printRange && (
              <PrintMulti bookId={bookId} pagesList={ed.pages} from={printRange.from} to={printRange.to} prefs={prefs} onDone={() => setPrintRange(null)} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
