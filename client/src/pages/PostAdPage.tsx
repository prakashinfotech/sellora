import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Check, ChevronRight, Upload, X } from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import { fetchCategoriesHandler } from '../store/slices/categoriesSlice';
import { createAdHandler } from '../store/slices/adsSlice';
import { uploadImages } from '../services/upload.service';

const STEPS = ['Category', 'Details', 'Photos & Location'];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
];

export default function PostAdPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.categories);
  const { loading } = useSelector((state: RootState) => state.ads);
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string } | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCategoriesHandler());
  }, [dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }
    const newFiles = [...imageFiles, ...files].slice(0, 5);
    setImageFiles(newFiles);
    const urls = newFiles.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const removeImage = (i: number) => {
    const newFiles = imageFiles.filter((_, idx) => idx !== i);
    const newPreviews = previews.filter((_, idx) => idx !== i);
    setImageFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !price) { toast.error('Title and price are required'); return; }
    setSubmitting(true);
    try {
      let images: string[] = [];
      if (imageFiles.length > 0) {
        const dt = new DataTransfer();
        imageFiles.forEach((f) => dt.items.add(f));
        images = await uploadImages(dt.files);
      }
      const result = await dispatch(createAdHandler({
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        categoryId: selectedCategory!.id,
        city: city.trim(),
        state: state.trim(),
        images,
      }));
      if (createAdHandler.fulfilled.match(result)) {
        toast.success('Ad posted successfully!');
        navigate(`/ads/${result.payload.id}`);
      } else {
        toast.error('Failed to post ad');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-sellora-bg min-h-screen py-6">
      <div className="max-w-2xl mx-auto px-4">
        {/* Stepper */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i < step ? 'bg-green-500 text-white' :
                  i === step ? 'bg-sellora-primary text-white' :
                  'bg-white border-2 border-sellora-border text-sellora-muted'
                }`}>
                  {i < step ? <Check size={16} /> : i + 1}
                </div>
                <span className={`text-xs mt-1 font-medium whitespace-nowrap ${i === step ? 'text-sellora-primary' : 'text-sellora-muted'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 ${i < step ? 'bg-green-500' : 'bg-sellora-border'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white border border-sellora-border rounded-lg p-6">
          {/* Step 0: Category */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold text-sellora-text mb-2">Choose a category</h2>
              <p className="text-sellora-muted text-sm mb-5">Select the most relevant category for your ad</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCategory(c); setStep(1); }}
                    className={`flex items-center gap-3 p-3 border-2 rounded-lg text-left hover:border-sellora-primary hover:bg-blue-50 transition-colors ${
                      selectedCategory?.id === c.id ? 'border-sellora-primary bg-blue-50' : 'border-sellora-border'
                    }`}
                  >
                    <span className="text-2xl shrink-0">
                      {c.slug === 'cars' ? '🚗' : c.slug === 'motorcycles' ? '🏍️' :
                       c.slug === 'mobile-phones' ? '📱' : c.slug === 'electronics' ? '💻' :
                       c.slug === 'furniture' ? '🛋️' : c.slug === 'fashion' ? '👗' :
                       c.slug === 'real-estate' ? '🏠' : c.slug === 'jobs' ? '💼' : '📦'}
                    </span>
                    <span className="text-sm font-medium text-sellora-text">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Details */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-sm text-sellora-muted">Category:</span>
                <span className="text-sm font-semibold text-sellora-primary">{selectedCategory?.name}</span>
                <button onClick={() => setStep(0)} className="text-xs text-sellora-muted underline ml-1">Change</button>
              </div>
              <h2 className="text-xl font-bold text-sellora-text mb-5">Ad details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-sellora-text mb-1">
                    Ad Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={70}
                    placeholder="e.g. iPhone 13 Pro Max 256GB"
                    className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary"
                  />
                  <p className="text-xs text-sellora-muted text-right mt-0.5">{title.length}/70</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-sellora-text mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={4096}
                    rows={5}
                    placeholder="Include condition, features, reason for selling..."
                    className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary resize-none"
                  />
                  <p className="text-xs text-sellora-muted text-right mt-0.5">{description.length}/4096</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-sellora-text mb-1">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sellora-muted font-semibold">₹</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      min={0}
                      placeholder="0"
                      className="w-full border border-sellora-border rounded pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary"
                    />
                  </div>
                </div>

                <button
                  onClick={() => { if (!title.trim() || !price) { toast.error('Title and price required'); return; } setStep(2); }}
                  className="w-full btn-gradient font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Photos & Location */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-sellora-text mb-5">Photos & Location</h2>
              <div className="space-y-5">
                {/* Photos */}
                <div>
                  <label className="block text-sm font-semibold text-sellora-text mb-2">
                    Photos <span className="text-sellora-muted font-normal">(up to 5)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {previews.map((src, i) => (
                      <div key={i} className="relative w-20 h-20 rounded overflow-hidden border border-sellora-border">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center"
                        >
                          <X size={10} />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] text-center py-0.5">Cover</span>
                        )}
                      </div>
                    ))}
                    {imageFiles.length < 5 && (
                      <label className="w-20 h-20 border-2 border-dashed border-sellora-border rounded flex flex-col items-center justify-center cursor-pointer hover:border-sellora-primary transition-colors">
                        <Upload size={20} className="text-sellora-muted" />
                        <span className="text-xs text-sellora-muted mt-1">Add</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                      </label>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-sellora-text mb-1">City</label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sellora-text mb-1">State</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary"
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-sellora-border text-sellora-text font-semibold py-3 rounded hover:bg-sellora-bg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || loading}
                    className="flex-1 btn-gradient font-semibold py-3 rounded-xl disabled:opacity-60"
                  >
                    {submitting || loading ? 'Posting...' : 'Post Your Ad'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
