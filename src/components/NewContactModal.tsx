import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "../lib/supabaseClient";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreate: () => void;
}

export default function NewContactModal({ open, onClose, onCreate }: Props) {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; date?: string; imageFile?: string }>({});

    const validate = () => {
        const newErrors: { name?: string; date?: string; imageFile?: string } = {};
        if (!name.trim()) newErrors.name = 'Name is required.';
        if (!date) newErrors.date = 'Date is required.';
        if (!imageFile) newErrors.imageFile = 'Image is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreate = async () => {
        if (!validate()) return;
        setIsLoading(true);
        if (!imageFile) {
            setIsLoading(false);
            return;
        }
        const { data: uploadData, error: uploadError } = await supabase.storage.from('contact-images').upload(`public/${new Date().getTime()}`, imageFile);
        if (uploadError) {
            console.error("Upload error:", uploadError);
            return alert("Upload failed");
        }

        const imageUrl = supabase.storage.from('contact-images').getPublicUrl(uploadData.path).data.publicUrl;
        await supabase.from('contacts').insert({ name, last_contact_date: date, image_url: imageUrl });
        setIsLoading(false);
        setName('');
        setDate('');
        setImageFile(null);
        onCreate();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader><DialogTitle>New Contact</DialogTitle></DialogHeader>
                {
                    isLoading ?
                        <div className="flex flex-col items-center justify-center py-10">
                            {/* <Loader2 className="animate-spin h-6 w-6 text-primary mb-2" /> */}
                            <p className="text-sm text-muted-foreground">Creating contact...</p>
                        </div>
                        :
                        <>
                            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                            <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                            {errors.imageFile && <p className="text-red-500 text-xs mt-1">{errors.imageFile}</p>}
                            <Button onClick={handleCreate} disabled={isLoading}>Create</Button>
                        </>
                }
            </DialogContent>
        </Dialog >
    );
}