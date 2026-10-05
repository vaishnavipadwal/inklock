import { useState, useEffect } from 'react';
import api from '../../api/books';
import Paper from './Paper';

let uid = 10000;
const fromApi = (blocks) => (blocks && blocks.length ? blocks.map(b => ({...b, key: ++uid})) : [{block_type:"text", content:"", key:++uid}]);

export default function PrintMulti({ bookId, pagesList, from, to, prefs, onDone }) {
  const [pagesData, setPagesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    (async () => {
      // Find pages in range
      const toFetch = pagesList.filter(p => p.page_number >= from && p.page_number <= to);
      if (toFetch.length === 0) {
        onDone();
        return;
      }
      try {
        const data = await Promise.all(
          toFetch.map(p => api.get(`/books/${bookId}/pages/${p.id}`).then(res => res.data))
        );
        if (live) {
          setPagesData(data);
          setLoading(false);
          // Wait for DOM and images to render then print
          setTimeout(() => {
            window.print();
            // We delay cleanup so the print dialog doesn't close on unmount immediately
            setTimeout(onDone, 500);
          }, 800);
        }
      } catch (e) {
        console.error(e);
        if (live) onDone();
      }
    })();
    return () => { live = false; };
  }, [bookId, pagesList, from, to, onDone]);

  if (loading) return <div className="ed-print-msg">Preparing PDF... please wait.</div>;

  return (
    <div className="print-multi-container">
      {pagesData.map(d => (
        <Paper
          key={d.id}
          prefs={prefs}
          pageNumber={d.page_number}
          title={d.title}
          onTitle={() => {}}
          blocks={fromApi(d.blocks)}
          onBlockChange={() => {}}
          onBlockDelete={() => {}}
          onBlockMove={() => {}}
          onAddBlock={() => {}}
        />
      ))}
    </div>
  );
}
