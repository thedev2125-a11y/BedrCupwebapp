import { useState } from 'react';
import { Plus } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { TextField, TextareaField, CheckboxField } from '../../components/admin/FormFields';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useData } from '../../hooks/useData';
import { useToast } from '../../hooks/useToast';
import { formatDisplayDate } from '../../utils/computeStats';

const EMPTY_FORM = { title: '', image: '', publishedAt: new Date().toISOString().slice(0, 10), excerpt: '', content: '', featured: false };

export default function AdminNews() {
  const { news, addNews, updateNews, deleteNews } = useData();
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

  function openEdit(article) {
    setEditingId(article.id);
    setForm({
      title: article.title,
      image: article.image || '',
      publishedAt: article.publishedAt,
      excerpt: article.excerpt || '',
      content: article.content || '',
      featured: !!article.featured,
    });
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.publishedAt) e.publishedAt = 'Date is required.';
    return e;
  }

  function handleSubmit() {
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setIsSaving(true);
    try {
      if (editingId) {
        updateNews(editingId, form);
        success('Article updated.');
      } else {
        addNews(form);
        success('Article published.');
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
      deleteNews(deleteTarget.id);
      success('Article deleted.');
    } catch (err) {
      toastError(err.message);
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="News"
        subtitle="Publish updates and stories to the public News page."
        action={
          <Button icon={Plus} onClick={openAdd}>
            Add Article
          </Button>
        }
      />

      <DataTable
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'publishedAt', label: 'Date', render: (n) => formatDisplayDate(n.publishedAt) },
          { key: 'featured', label: 'Featured', render: (n) => (n.featured ? <Badge tone="gold">Featured</Badge> : '—') },
        ]}
        rows={news}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyMessage="No articles yet."
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        title={editingId ? 'Edit Article' : 'Add Article'}
      >
        <TextField label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} error={errors.title} />
        <TextField
          label="Image URL"
          hint="Paste a link to an image (e.g. from Unsplash or your own hosting)."
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <TextField
          label="Publish Date"
          type="date"
          required
          value={form.publishedAt}
          onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
          error={errors.publishedAt}
        />
        <TextareaField
          label="Excerpt"
          rows={2}
          hint="Short summary shown on article cards."
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        />
        <TextareaField
          label="Full Content"
          rows={5}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <CheckboxField
          label="Feature this article at the top of the News page"
          checked={form.featured}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
        />
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this article?"
        message="This article will be permanently removed from the News page."
      />
    </div>
  );
}
