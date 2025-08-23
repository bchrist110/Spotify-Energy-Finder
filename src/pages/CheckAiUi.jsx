import React, { useState } from 'react';
// Removed unused Link import
import Header from '../components/Header';

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const sampleImports = import.meta.glob('../examplePhotos/*.{png,jpg,jpeg,JPG,webp}', { eager: true, import: 'default', query: '?url' });
  const samplePhotos = Object.entries(sampleImports).map(([path, url]) => ({
    path,
    url,
    name: path.split('/').pop(),
  }));

  const selectSample = async (url, name = 'sample.jpg') => {
    try {
      setLoading(true);
      const res = await fetch(url, { cache: 'no-store' });
      const blob = await res.blob();
      const file = new File([blob], name, { type: blob.type || 'image/jpeg' });
      setImage(file);
      setPreview(URL.createObjectURL(blob));
      setResult(null);
    } catch (e) {
      console.error(e);
      alert('Unable to load sample image.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append('image', image);

    try {
      setLoading(true);
      const res = await fetch('https://handwriter-django.onrender.com/api/check/', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        let msg = 'Request failed';
        try { const err = await res.json(); msg = err.error || msg } catch { /* ignore */ }
        throw new Error(msg);
      }
      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert('Error: ' + (error.message || 'Unknown'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white overflow-hidden relative bg-black">
      <Header />
      {/* Background layers */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80')" }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-sky-500/30 via-violet-600/25 to-black/80" />
      <div className="relative min-h-screen flex flex-col justify-center items-center px-4 md:px-8">
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-black/20 via-sky-900/10 to-transparent" />

        <div className="relative z-20 text-center max-w-6xl mx-auto pt-00 md:pt-14">
          <h1 className="hero-title">Check AI</h1>
          <h2 className="hero-sub">Advanced Handwritten Check Alteration Detection</h2>
          <p className="hero-lead">Upload an image of a check and see if it has been altered.</p>

          {samplePhotos.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs tracking-widest uppercase text-white/70">Try sample images</h3>
                <button
                  type="button"
                  onClick={() => {
                    const rnd = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
                    selectSample(rnd.url, rnd.name);
                  }}
                  className="text-xs text-sky-200 hover:text-white transition-colors"
                >
                  Random
                </button>
              </div>
              <div className="thumb-scroll">
                {samplePhotos.map((p) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => selectSample(p.url, p.name)}
                    className="thumb-card"
                    title={`Use ${p.name}`}
                  >
                    <img src={p.url} alt={p.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute bottom-2 left-2 right-2 text-[11px] text-white/95 drop-shadow">Use this</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="glass-panel">
            <div className="mb-10">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="upload-box">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-12 h-12 mb-4 text-sky-200/80 group-hover:text-fuchsia-200 transition-colors duration-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-white/80 group-hover:text-white"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-white/70">{image ? image.name : 'PNG, JPG, JPEG (MAX. 10MB)'}</p>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-sky-400/10 via-cyan-400/10 to-fuchsia-500/10" />
              </label>
            </div>

            {preview && (
              <div className="mb-10">
                <div className="relative rounded-2xl overflow-hidden bg-black/30 p-4 border border-white/10">
                  <img src={preview} alt="Upload preview" className="w-full h-auto max-h-80 object-contain rounded-xl mx-auto" />
                </div>
              </div>
            )}

            <button onClick={handleSubmit} disabled={!image || loading} className="primary-btn">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 0 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Image...
                  </div>
                  <span className="text-[11px] font-normal tracking-wide text-white/80 animate-pulse">This may take a few seconds</span>
                </div>
              ) : (
                'Analyze Image'
              )}
            </button>
            {loading && <p className="mt-3 text-xs text-sky-200/80 animate-pulse">Processing with AI — hang tight...</p>}

            {result && (
              <div className="mt-12 pt-10 border-t border-white/10">
                <h3 className="analysis-title">Analysis Complete</h3>
                <div className="bg-white/10 rounded-2xl p-8 border border-white/10">
                  <div className="text-center mb-6">
                    <p className="text-xl font-light text-white/90 leading-relaxed drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">{result.message}</p>
                  </div>
                  {result.image_url && (
                    <div className="mt-8">
                      <h4 className="analysis-sub">Detailed Analysis</h4>
                      <div className="relative rounded-2xl overflow-hidden bg-black/30 p-4 border border-white/10">
                        <img src={result.image_url} alt="Analysis result with annotations" className="w-full h-auto max-h-96 object-contain rounded-xl mx-auto" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sky-100/80 text-sm font-light">Powered by AI • Secure • Private</p>
          </div>
        </div>
      </div>
    </div>
  );
}
