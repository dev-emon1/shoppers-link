import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CreateProductTemplate() {
    const [childCategories, setChildCategories] = useState([]);
    const [form, setForm] = useState({
        child_category_id: '',
        template_sku: '',
        barcode: '',
        name: ''
    });

    useEffect(() => {
        axios.get('/api/child-categories').then(res => setChildCategories(res.data));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/product-templates', form).then(res => {
            alert('Template Created!');
            setForm({ child_category_id: '', template_sku: '', barcode: '', name: '' });
        }).catch(err => console.log(err));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Product Template</h2>

            <select
                value={form.child_category_id}
                onChange={e => setForm({ ...form, child_category_id: e.target.value })}
            >
                <option value="">Select Child Category</option>
                {childCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>

            <input
                type="text"
                placeholder="Template SKU"
                value={form.template_sku}
                onChange={e => setForm({ ...form, template_sku: e.target.value })}
            />

            <input
                type="text"
                placeholder="Barcode"
                value={form.barcode}
                onChange={e => setForm({ ...form, barcode: e.target.value })}
            />

            <input
                type="text"
                placeholder="Template Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <button type="submit">Create Template</button>
        </form>
    );
}
