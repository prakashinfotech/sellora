import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Upload, X, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchAdByIdHandler, updateAdHandler } from '../store/slices/adsSlice';
import { fetchCategoriesHandler } from '../store/slices/categoriesSlice';
import { uploadImages } from '../services/upload.service';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
];

export default function EditAdPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentAd, loading } = useSelector((state: RootState) => state.ads);
  const { categories } = useSelector((state: RootState) => state.categories);
  const { user } = useSelector((state: RootState) => state.auth);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [city, setCity] = useState('');
  const [adState, setAdState] = useState('');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCategoriesHandler());
    if (id) dispatch(fetchAdByIdHandler(Number(id)));
  }, [dispatch, id]);

  useEffect(() => {
    if (!currentAd) return;
    if (user && currentAd.userId !== user.id) {
      toast.error("You can't edit this ad");
      navigate('/my-ads');
      return;
    }
    setTitle(currentAd.title || '');
    setDescription(currentAd.description || '');
    setPrice(String(currentAd.price || ''));
    setCategoryId(currentAd.categoryId || '');
    setCity(currentAd.city || '');
    setAdState(currentAd.state || '');
    setExistingImages(Array.isArray(currentAd.images) ? currentAd.images : []);
  }, [currentAd, user, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const total = existingImages.length + newFiles.length + files.length;
    if (total > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }
    const combined = [...newFiles, ...files];
    setNewFiles(combined);
    setNewPreviews(combined.map((f) => URL.createObjectURL(f)));
  };

  const removeExisting = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNew = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !price || !categoryId) {
      toast.error('Title, price and category are required');
      return;
    }
    setSubmitting(true);
    try {
      let uploadedUrls: string[] = [];
      if (newFiles.length > 0) {
        const dt = new DataTransfer();
        newFiles.forEach((f) => dt.items.add(f));
        uploadedUrls = await uploadImages(dt.files);
      }
      const images = [...existingImages, ...uploadedUrls];
      const result = await dispatch(updateAdHandler({
        id: Number(id),
        payload: {
          title: title.trim(),
          description: description.trim(),
          price: Number(price),
          categoryId: Number(categoryId),
          city: city.trim(),
          state: adState,
          images,
        },
      }));
      if (updateAdHandler.fulfilled.match(result)) {
        toast.success('Ad updated!');
        navigate('/my-ads');
      } else {
        toast.error('Failed to update ad');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !currentAd) {
    return (
      <div className="bg-sellora-bg min-h-screen py-6">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border border-sellora-border rounded-lg h-14 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const totalImages = existingImages.length + newFiles.length;

  return (
    <div className="bg-sellora-bg min-h-screen py-6">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate('/my-ads')}
          className="flex items-center gap-2 text-sm text-sellora-muted hover:text-sellora-primary mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Back to My Ads
        </button>

        <div className="bg-white border border-sellora-border rounded-lg p-6 space-y-5">
          <h1 className="text-xl font-bold text-sellora-text">Edit Ad</h1>

          {/* Title */}
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

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-sellora-text mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Description */}
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

          {/* Price */}
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
                value={adState}
                onChange={(e) => setAdState(e.target.value)}
                className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary"
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-semibold text-sellora-text mb-2">
              Photos <span className="text-sellora-muted font-normal">(up to 5)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {/* Existing images */}
              {existingImages.map((src, i) => (
                <div key={`existing-${i}`} className="relative w-20 h-20 rounded overflow-hidden border border-sellora-border">
                  <img
                    src={src.startsWith('http') ? src : `${import.meta.env.VITE_API_URL}${src}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeExisting(i)}
                    className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <X size={10} />
                  </button>
                  {i === 0 && existingImages.length > 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] text-center py-0.5">Cover</span>
                  )}
                </div>
              ))}
              {/* New image previews */}
              {newPreviews.map((src, i) => (
                <div key={`new-${i}`} className="relative w-20 h-20 rounded overflow-hidden border border-sellora-primary">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeNew(i)}
                    className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <X size={10} />
                  </button>
                  <span className="absolute bottom-0 left-0 right-0 bg-sellora-primary/70 text-white text-[9px] text-center py-0.5">New</span>
                </div>
              ))}
              {/* Add more button */}
              {totalImages < 5 && (
                <label className="w-20 h-20 border-2 border-dashed border-sellora-border rounded flex flex-col items-center justify-center cursor-pointer hover:border-sellora-primary transition-colors">
                  <Upload size={20} className="text-sellora-muted" />
                  <span className="text-xs text-sellora-muted mt-1">Add</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => navigate('/my-ads')}
              className="flex-1 border border-sellora-border text-sellora-text font-semibold py-3 rounded hover:bg-sellora-bg transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 btn-gradient font-semibold py-3 rounded-xl disabled:opacity-60 text-sm"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
