import Modal from '../common/Modal';
import Button from '../common/Button';

export default function FormModal({ isOpen, onClose, title, onSubmit, isSaving, children, submitLabel = 'Save' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="p-6"
      >
        <h3 className="font-display text-xl text-ink dark:text-chalk-50 mb-5">{title}</h3>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 -mr-1">{children}</div>
        <div className="flex gap-3 justify-end mt-6 pt-5 border-t border-black/[0.06] dark:border-white/[0.08]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="!text-ink !border-ink dark:!text-chalk-50 dark:!border-chalk-50"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving…' : submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
