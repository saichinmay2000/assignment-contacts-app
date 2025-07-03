import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "../lib/supabaseClient";

interface Contact {
    id: string;
    name: string;
    image_url: string;
    last_contact_date: string;
}

interface Props {
    contact: Contact | null;
    onClose: () => void;
    onUpdate: () => void;
}

export default function ContactInfoModal({ contact, onClose, onUpdate }: Props) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (contact) {
            setName(contact.name);
            setDate(contact.last_contact_date);
            setImageFile(null);
        }
    }, [contact]);

    const handleUpdate = async () => {
        if (!contact) return;
        setIsUpdating(true);

        let newImageUrl = contact.image_url;

        if (imageFile) {
            const filePath = `public/${Date.now()}-${imageFile.name}`;
            const { error: uploadError } = await supabase.storage
                .from('contact-images')
                .upload(filePath, imageFile);

            if (uploadError) {
                alert("Image upload failed");
                console.error(uploadError);
                setIsUpdating(false);
                return;
            }

            const { data: publicUrlData } = supabase
                .storage
                .from('contact-images')
                .getPublicUrl(filePath);

            newImageUrl = publicUrlData.publicUrl;
        }

        await supabase
            .from('contacts')
            .update({
                name,
                last_contact_date: date,
                image_url: newImageUrl
            })
            .eq('id', contact.id);

        setIsUpdating(false);
        setEditing(false);
        onUpdate();
        onClose();
    };

    const handleDelete = async () => {
        if (!contact) return;
        await supabase.from('contacts').delete().eq('id', contact.id);
        onUpdate();
        onClose();
    };

    return (
        <Dialog open={!!contact} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Contact Info</DialogTitle>
                </DialogHeader>

                {isUpdating ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <p className="text-sm text-muted-foreground">Updating contact...</p>
                    </div>
                ) : (
                    <>
                        <img
                            src={contact?.image_url}
                            className="w-20 h-20 rounded-full object-cover mb-2"
                            alt="avatar"
                        />
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!editing}
                        />
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            disabled={!editing}
                        />
                        {editing && (
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            />
                        )}
                        {editing ? (
                            <Button onClick={handleUpdate}>Save</Button>
                        ) : (
                            <Button onClick={() => setEditing(true)}>Edit</Button>
                        )}
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
