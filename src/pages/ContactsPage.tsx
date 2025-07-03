import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import NewContactModal from "../components/NewContactModal";
import ContactInfoModal from "../components/ContactInfoModal";
import { supabase } from "../lib/supabaseClient";

interface Contact {
    id: string;
    name: string;
    image_url: string;
    last_contact_date: string;
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selected, setSelected] = useState<Contact | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchContacts = async () => {
        setIsLoading(true);
        const { data } = await supabase.from('contacts').select('*').order('last_contact_date', { ascending: true });
        setContacts(data || []);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-bold">Contacts</h1>
                <Button onClick={() => setShowModal(true)}>Add Contact</Button>
            </div>
            {
                isLoading ? (
                    <div className="text-center">Loading contacts...</div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {contacts.length === 0 ? <p>No contacts found.</p> : contacts.map(c => (
                            <div key={c.id} className="p-4 border rounded cursor-pointer" onClick={() => setSelected(c)}>
                                <img src={c.image_url} className="w-16 h-16 rounded-full mb-2" alt="avatar" />
                                <p className="font-medium">{c.name}</p>
                                <p className="text-sm text-gray-500">Last contacted: {c.last_contact_date}</p>
                            </div>
                        ))}
                    </div>
                )
            }
            <NewContactModal open={showModal} onClose={() => setShowModal(false)} onCreate={fetchContacts} />
            <ContactInfoModal contact={selected} onClose={() => setSelected(null)} onUpdate={fetchContacts} />
        </div>
    );
}
