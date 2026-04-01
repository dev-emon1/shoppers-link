import React, { useState } from "react";
import { toast } from "react-hot-toast";
import API, { IMAGE_URL } from "../../utils/api";

export default function ShopProfile({ data }) {
  const vendor = data?.vendor || {};
  const user = data?.user || {};

  const isVendor = user?.type === "vendor";

  const [edited, setEdited] = useState({
    shop_name: vendor.shop_name || "",
    owner_name: vendor.owner_name || "",
    contact_number: vendor.contact_number || "",
    description: vendor.description || "",
    address: vendor.address || "",
    city: vendor.city || "",
    state: vendor.state || "",
    postal_code: vendor.postal_code || "",
    country: vendor.country || "",
    link: vendor.link || "",
    logo: null,
    banner: null,
    nid_front: null,
    nid_back: null,
    trade_license: null,
  });

  const [loading, setLoading] = useState(false);

  // TEXT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdited((prev) => ({ ...prev, [name]: value }));
  };

  // FILE CHANGE (PDF + IMAGE)
  const handleImageChange = (name, file) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP or PDF allowed");
      return;
    }

    setEdited((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  // SUBMIT (MAIN FIX)
  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();

    Object.keys(edited).forEach((key) => {
      const value = edited[key];

      // send only file
      if (value instanceof File) {
        formData.append(key, value);
      }

      // send only non-empty text
      else if (value !== "" && value !== null) {
        formData.append(key, value);
      }
    });

    try {
      const res = await API.post("/profile/update", formData);

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log("ERROR:", err.response?.data);

      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        toast.error(firstError);
      } else {
        toast.error("Update failed");
      }
    }

    setLoading(false);
  };

  // ✅ INPUT FIELD
  const editableField = (label, name, type = "text") => (
    <div>
      <label className="text-xs font-semibold text-gray-500">{label}</label>

      {type === "textarea" ? (
        <textarea
          name={name}
          value={edited[name]}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={edited[name]}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
      )}
    </div>
  );

  // ✅ IMAGE / FILE SLOT
  const imageSlot = (label, name, oldSrc) => {
    const preview =
      edited[name] instanceof File
        ? URL.createObjectURL(edited[name])
        : oldSrc
          ? `${IMAGE_URL}/${oldSrc}`
          : null;

    return (
      <div>
        <label className="text-xs font-semibold text-gray-500">{label}</label>

        <label className="mt-2 block h-40 w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
          {preview ? (
            <img src={preview} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400 text-sm">
              Click to upload
            </div>
          )}

          <input
            type="file"
            accept="image/*,.pdf" // 🔥 important
            className="hidden"
            onChange={(e) => handleImageChange(name, e.target.files[0])}
          />
        </label>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="grid gap-6 rounded-xl bg-white p-6 shadow-lg">
        {/* BASIC INFO */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500">
              Username
            </label>
            <p className="text-sm">{user.user_name}</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500">Email</label>
            <p className="text-sm">{user.email}</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500">Phone</label>
            <p className="text-sm">{user.phone || "—"}</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500">
              Account Type
            </label>
            <p className="text-sm capitalize">{user.type}</p>
          </div>
        </div>

        {/* VENDOR */}
        {isVendor && (
          <>
            {imageSlot("Banner", "banner", vendor.banner)}

            <div className="flex gap-6">
              <div className="w-40">
                {imageSlot("Logo", "logo", vendor.logo)}
              </div>

              <div className="flex-1 space-y-4">
                {editableField("Shop Name", "shop_name")}
                {editableField("Owner Name", "owner_name")}
                {editableField("Contact Number", "contact_number")}
              </div>
            </div>

            {editableField("Description", "description", "textarea")}

            <div className="grid grid-cols-3 gap-4">
              {editableField("Address", "address")}
              {editableField("City", "city")}
              {editableField("State", "state")}
              {editableField("Postal Code", "postal_code")}
              {editableField("Country", "country")}
              {editableField("Link", "link")}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {imageSlot("NID Front", "nid_front", vendor.nid_front)}
              {imageSlot("NID Back", "nid_back", vendor.nid_back)}
              {imageSlot(
                "Trade License",
                "trade_license",
                vendor.trade_license,
              )}
            </div>
          </>
        )}

        {/* BUTTON */}
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-md bg-main px-6 py-2 text-white"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
