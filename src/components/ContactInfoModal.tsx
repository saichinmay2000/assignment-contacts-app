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

    useEffect(() => {
        if (contact) {
            setName(contact.name);
            setDate(contact.last_contact_date);
        }
    }, [contact]);

    const handleUpdate = async () => {
        if (!contact) return;
        await supabase.from('contacts').update({ name, last_contact_date: date }).eq('id', contact.id);
        onUpdate();
        setEditing(false);
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
                <DialogHeader><DialogTitle>Contact Info</DialogTitle></DialogHeader>
                <img src={contact?.image_url} className="w-20 h-20 rounded-full" alt="avatar" />
                <Input value={name} onChange={(e) => setName(e.target.value)} disabled={!editing} />
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={!editing} />
                {editing ? <Button onClick={handleUpdate}>Save</Button> : <Button onClick={() => setEditing(true)}>Edit</Button>}
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogContent>
        </Dialog>
    );
}
