import React, { useState, useEffect } from "react";
import { X, Image as ImageIcon, Star } from "lucide-react";
import ImageUploader from "../../../../components/common/ImageUploader";
import API from "../../../../utils/api";

const StepMedia = ({ formData, onChange }) => {
  const [gallery, setGallery] = useState(formData.images || []);
  const [featured, setFeatured] = useState(formData.featured || null);
  const [colorImages, setColorImages] = useState({});
  const [colorKeys, setColorKeys] = useState({});
  const [hasUserSetFeatured, setHasUserSetFeatured] = useState(false);
  const [attributes, setAttributes] = useState([]);

  // Fetch attributes from API
  useEffect(() => {
    API.get("/attributes")
      .then((res) => {
        setAttributes(res.data.data);
      })
      .catch((err) => console.error("Failed to fetch attributes:", err));
  }, []);

  // === Detect color attribute ===
  const colorAttrId = formData?.variantMeta?.selectedAttributes?.find((id) => {
    const attr = attributes.find((a) => a.id === id);
    return attr?.name?.toLowerCase() === "color";
  });

  const colorAttribute = colorAttrId
    ? attributes.find((a) => a.id === colorAttrId)
    : null;

  const colorValues = colorAttribute
    ? formData?.variantMeta?.selectedValues?.[colorAttribute.id] || []
    : [];

  // === Maintain unique keys per color for stable render ===
  useEffect(() => {
    const keys = {};
    colorValues.forEach((color) => {
      keys[color] = colorKeys[color] || crypto.randomUUID();
    });
    setColorKeys(keys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorValues.join(",")]);

  // === Sync local state when coming back ===
  useEffect(() => {
    setGallery(formData.images || []);
    setFeatured(formData.featured || null);
    setColorImages(formData.colorImages || {});
    setHasUserSetFeatured(!!formData.featured);
  }, [formData]);

  // === General Upload (append only, max 6) ===
  const handleGeneralUpload = (files) => {
    const fileArray = Array.isArray(files) ? files : [files];
    const newImages = fileArray.map((file) => ({
      id: crypto.randomUUID?.() || Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setGallery((prev) => {
      const merged = [...prev, ...newImages].slice(0, 6);
      onChange("images", merged);
      onChange("images", merged, { shouldValidate: true });

      if (!featured && !hasUserSetFeatured && merged.length > 0) {
        setFeatured(merged[0].id);
        onChange("featured", merged[0].id, { shouldValidate: true });
      }
      return merged;
    });
  };

  // === Color-wise Upload (1 per color) ===
  const handleColorUpload = (color, file) => {
    const imgObj = {
      id: crypto.randomUUID?.() || Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
    };

    setColorImages((prev) => {
      if (prev[color]?.[0]?.preview) {
        URL.revokeObjectURL(prev[color][0].preview);
      }
      const updated = { ...prev, [color]: [imgObj] };
      onChange("colorImages", updated, { shouldValidate: true });

      setColorKeys((keys) => ({ ...keys, [color]: crypto.randomUUID() }));

      if (!featured && !hasUserSetFeatured) {
        setFeatured(imgObj.id);
        onChange("featured", imgObj.id, { shouldValidate: true });
      }
      return updated;
    });
  };

  // === Remove image(s) ===
  const handleRemove = (color = null, id = null) => {
    if (color) {
      setColorImages((prev) => {
        const currentImg = prev[color]?.[0] || null;
        const updated = { ...prev, [color]: [] };
        onChange("colorImages", updated, { shouldValidate: true });

        if (currentImg && featured === currentImg.id) {
          setFeatured(null);
          onChange("featured", null, { shouldValidate: true });
        }

        setColorKeys((keys) => ({ ...keys, [color]: crypto.randomUUID() }));
        return updated;
      });
    } else if (id) {
      setGallery((prev) => {
        const updated = prev.filter((img) => img.id !== id);
        onChange("images", updated, { shouldValidate: true });

        if (featured === id) {
          const fallback = updated[0]?.id || null;
          setFeatured(fallback);
          onChange("featured", fallback, { shouldValidate: true });
        }
        return updated;
      });
    } else {
      // remove all (for clear button)
      gallery.forEach((img) => URL.revokeObjectURL(img.preview));
      setGallery([]);
      onChange("images", [], { shouldValidate: true });
      setFeatured(null);
      onChange("featured", null, { shouldValidate: true });
      setHasUserSetFeatured(false);
    }
  };

  // === Featured toggle ===
  const handleFeatured = (id) => {
    const newFeatured = featured === id ? null : id;
    setFeatured(newFeatured);
    setHasUserSetFeatured(true);
    onChange("featured", newFeatured, { shouldValidate: true });
  };

  // === Auto-select first featured (only once) ===
  useEffect(() => {
    if (featured || hasUserSetFeatured) return;

    let newFeatured = null;
    const clrKeys = Object.keys(colorImages || {});

    for (const clr of clrKeys) {
      const firstImg = colorImages[clr]?.[0];
      if (firstImg) {
        newFeatured = firstImg.id;
        break;
      }
    }

    if (!newFeatured && gallery.length > 0) {
      newFeatured = gallery[0].id;
    }

    if (newFeatured) {
      setFeatured(newFeatured);
      onChange("featured", newFeatured, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorImages, gallery]);

  // === Cleanup URLs ===
  useEffect(() => {
    return () => {
      gallery.forEach((img) => URL.revokeObjectURL(img.preview));
      Object.values(colorImages)
        .flat()
        .forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, []);

  // === Render color card ===
  const renderColorCard = (color) => {
    const image = colorImages[color]?.[0] || null;
    const isFeatured = image ? featured === image.id : false;

    return (
      <div
        key={colorKeys[color]}
        className="border border-border rounded-xl bg-gray-50/40 p-3 flex flex-col items-center justify-start text-center shadow-sm hover:shadow-md transition"
      >
        <h4 className="font-semibold text-main mb-2">{color}</h4>

        {!image ? (
          <div className="w-full">
            <ImageUploader
              key={`uploader-${colorKeys[color]}`}
              uploaderId={`uploader-${colorKeys[color]}`}
              multiple={false}
              onFileSelect={(file) => handleColorUpload(color, file)}
            />
          </div>
        ) : (
          <div className="relative w-full">
            <img
              src={image.preview}
              alt={color}
              className="object-cover w-full aspect-square rounded-lg border"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-2 rounded-lg">
              <button
                onClick={() => handleFeatured(image.id)}
                className={`p-2 rounded-full ${isFeatured
                  ? "bg-yellow-400 text-white"
                  : "bg-white text-gray-800 hover:bg-main hover:text-white"
                  }`}
                title={isFeatured ? "Unset Featured" : "Set Featured"}
              >
                <Star size={24} className={isFeatured ? "fill-main" : ""} />
              </button>
              <button
                onClick={() => handleRemove(color)}
                className="p-2 bg-red text-white rounded-full hover:bg-deepRed transition"
                title="Remove"
              >
                <X size={22} />
              </button>
            </div>

            {isFeatured && (
              <div className="absolute bottom-1 left-1 bg-yellow-400 text-white text-[11px] font-medium px-2 py-0.5 rounded">
                Featured
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // === Render general gallery ===
  const renderGallery = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
      {gallery.map((img) => {
        const isFeatured = featured === img.id;
        return (
          <div
            key={img.id}
            className={`relative group rounded-lg overflow-hidden border transition hover:shadow-md ${isFeatured ? "border-main ring-2 ring-main" : "border-gray-200"
              }`}
          >
            <img
              src={img.preview}
              alt="preview"
              className="object-cover w-full aspect-square"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
              <button
                onClick={() => handleFeatured(img.id)}
                className={`p-2 rounded-full ${isFeatured
                  ? "bg-yellow-400 text-white"
                  : "bg-white text-gray-800 hover:bg-main hover:text-white"
                  }`}
                title={isFeatured ? "Unset Featured" : "Set Featured"}
              >
                <Star size={22} className={isFeatured ? "fill-main" : ""} />
              </button>
              <button
                onClick={() => handleRemove(null, img.id)}
                className="p-2 bg-red text-white rounded-full hover:bg-deepRed transition"
                title="Remove this image"
              >
                <X size={22} />
              </button>
            </div>
            {isFeatured && (
              <div className="absolute bottom-1 left-1 bg-yellow-400 text-white text-[11px] font-medium px-2 py-0.5 rounded">
                Featured
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  // === Render UI ===
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-2 mb-3">
        <ImageIcon className="w-5 h-5 text-main" />
        <h2 className="text-lg font-semibold text-gray-800">
          Product Media Upload
        </h2>
      </div>

      {colorAttribute && colorValues.length > 0 ? (
        <>
          <p className="text-sm text-gray-600 mb-3">
            Upload one image per color variant:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {colorValues.map((color) => renderColorCard(color))}
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-2">
            Upload general product images (Each under 2MB)
          </p>

          {/* Always show uploader, disable after 6 */}
          {gallery.length < 6 && (
            <ImageUploader multiple={true} onFileSelect={handleGeneralUpload} />
          )}

          {/* Gallery */}
          {gallery.length > 0 && renderGallery()}

          <p className="text-xs text-gray-500 mt-2">
            {gallery.length}/6 images uploaded. Minimum 2 required.
          </p>
        </>
      )}
    </div>
  );
};

export default StepMedia;