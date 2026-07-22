import { useState } from 'react';
import { Plus } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { TextField, SelectField } from '../../components/admin/FormFields';
import Button from '../../components/common/Button';
import { useData } from '../../hooks/useData';
import { useToast } from '../../hooks/useToast';

const CATEGORY_OPTIONS = ['Matches', 'Fans', 'Training', 'Celebrations'].map((c) => ({ value: c, label: c }));
const EMPTY_FORM = { category: 'Matches', caption: '', image: '' };

export default function AdminGallery() {
  const { gallery, addGalleryImage, updateGalleryImage, deleteGalleryImage } = useData();
  const { success, error: toastError } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(photo) {
    setEditingId(photo.id);
    setForm({ category: photo.category, caption: photo.caption || '', image: photo.image });
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const e = {};
    if (!form.image.trim()) e.image = 'Image URL is required.';
    return e;
  }

  function handleSubmit() {
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setIsSaving(true);
    try {
      if (editingId) {
        updateGalleryImage(editingId, form);
        success('Photo updated.');
      } else {
        addGalleryImage(form);
        success('Photo added.');
      }
      setModalOpen(false);
    } catch (err) {
      toastError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleDelete() {
    try {
      deleteGalleryImage(deleteTarget.id);
      success('Photo removed.');
    } catch (err) {
      toastError(err.message);
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        subtitle="Manage photos shown on the public Gallery page."
        action={
          <Button icon={Plus} onClick={openAdd}>
            Add Photo
          </Button>
        }
      />

      <DataTable
        columns={[
          {
            key: 'image',
            label: 'Preview',
            render: (g) => (
              <img src={g.image} alt={g.caption} className="h-12 w-12 rounded-lg object-cover" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
            ),
          },
          { key: 'category', label: 'Category' },
          { key: 'caption', label: 'Caption' },
        ]}
        rows={gallery}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyMessage="No photos yet."
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        title={editingId ? 'Edit Photo' : 'Add Photo'}
      >
        <TextField
          label="Image URL"
          required
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          error={errors.image}
        />
        <SelectField
          label="Category"
          options={CATEGORY_OPTIONS}
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <TextField label="Caption" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} />
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this photo?"
        message="This photo will be permanently removed from the Gallery page."
      />
    </div>
  );
}
